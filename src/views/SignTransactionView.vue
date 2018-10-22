<template>
    <div class="home">
        <div v-if="isInitialised">
            <div class="logo-wrapper">
                <img class="logo" alt="Arkane Logo" src="../assets/logo-arkane-animated.svg"/>
            </div>
            <numpad :title="'Enter your pincode to sign this transaction'"
                    :params="transactionData"
                    :disabled="hasBlockingError"
                    @signed="sendTransactionSignedMessage"
                    @pincode_incorrect="wrongPincodeMessage"
                    @pincode_no_tries_left="noTriesLeftMessage"></numpad>
        </div>
        <div v-else>
            <p>{{loadingText}}</p>
        </div>
    </div>
</template>

<script lang='ts'>
    import {Component, Vue} from 'vue-property-decorator';
    import Numpad from '@/components/molecules/Numpad.vue';
    import {EVENT_TYPES} from '../types/EventTypes';
    import ResponseBody from '@/api/ResponseBody';
    import {State} from 'vuex-class';
    import Security from '../Security';
    import Api from '../api';
    import {Wallet} from '../models/Wallet';

    declare const window: Window;

    @Component({
        components: {
            Numpad,
        },
    })
    export default class SignTransactionView extends Vue {
        public loadingText = 'Initializing signer ...';

        public transactionData?: any;

        @State
        public auth: any;
        @State
        public hasBlockingError!: boolean;
        @State
        public transactionWallet?: Wallet;

        private parentWindow!: Window;
        private parentOrigin!: string;
        private hasTransactionData: boolean = false;
        private messagePort?: MessagePort;

        public created() {
            if (!this.auth) {
                this.loadingText = 'Not authenticated, going back in 3 seconds.';
                setTimeout(() => {
                    (window as any).close();
                }, 3000);
            }
        }

        public mounted() {
            this.addEventListeners();
            this.initMessageChannel();
        }

        private noTriesLeftMessage() {
            this.$store.dispatch('setError', 'You entered a wrong pincode too many times.');
        }

        private wrongPincodeMessage() {
            this.$store.dispatch('setError', 'Wrong pincode');
        }

        private get isInitialised() {
            return Security.isLoggedIn && this.hasTransactionData;
        }

        private initMessageChannel() {
            const messageChannel = new MessageChannel();
            this.messagePort = messageChannel.port1;
            this.messagePort.onmessage = this.onMessage;
            window.opener.postMessage({type: EVENT_TYPES.SIGNER_MOUNTED}, '*', [messageChannel.port2]);
        }

        private async onMessage(event: MessageEvent) {
            const data = event.data;
            if (data && data.type === EVENT_TYPES.SEND_TRANSACTION_DATA) {
                this.transactionData = {...data.params};
                this.parentOrigin = event.origin;
                this.parentWindow = (event.source as Window);
                await this.fetchWallet(this.transactionData);
                this.hasTransactionData = true;
            }
        }

        private sendTransactionSignedMessage(result: ResponseBody) {
            if (this.messagePort) {
                this.messagePort.postMessage({type: EVENT_TYPES.TRANSACTION_SIGNED, data: result});
            }
        }

        private addEventListeners() {
            window.addEventListener('beforeunload', () => {
                if (this.messagePort) {
                    this.messagePort.postMessage({type: EVENT_TYPES.POPUP_CLOSED});
                    this.messagePort.close();
                }
            });
        }

        private async fetchWallet(transactionData: any): Promise<boolean> {
            return Api.getWallet(transactionData.walletId)
                      .then((wallet: Wallet) => {
                          this.$store.dispatch('setTransactionWallet', wallet);
                          if (wallet && wallet.balance && wallet.balance.gasBalance <= 0) {
                              this.$store.dispatch('setBlockingError', 'This wallet has insufficient gas to execute a transaction');
                              return false;
                          } else {
                              return true;
                          }
                      }).catch((result: any) => {
                    this.$store.dispatch('setBlockingError', 'Something went wrong while trying to fetch the wallet. Please close this window and try again. If the problem ' +
                        'persists, contact support at support@arkane.network');
                    return false;
                });
        }
    }
</script>

<style lang='sass' scoped>
    .logo-wrapper
        margin-top: 10px
        margin-bottom: 20px
        border-bottom: 1px solid #e5e5e5
        text-align: center

        .logo
            padding: 5px
            width: auto
            height: 48px
            @media (min-height: 600px)
                height: 60px
</style>
