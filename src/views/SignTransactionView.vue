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
    import {Balance} from '../models/Balance';

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

        private parentWindow!: Window;
        private parentOrigin!: string;
        private hasTransactionData: boolean = false;

        public created() {
            if (!this.auth) {
                this.loadingText = 'Not authenticated, going back in 3 seconds.';
                setTimeout(() => {
                    (window as any).close();
                }, 3000);
            }
        }

        public noTriesLeftMessage() {
            this.$store.dispatch('setError', 'You entered a wrong pincode too many times.');
        }

        public wrongPincodeMessage() {
            this.$store.dispatch('setError', 'Wrong pincode');
        }

        public mounted() {
            this.addEventListeners();
            window.opener.postMessage({type: EVENT_TYPES.SIGNER_MOUNTED}, '*');
        }

        private sendTransactionSignedMessage(result: ResponseBody) {
            this.parentWindow.postMessage({
                type: EVENT_TYPES.TRANSACTION_SIGNED,
                data: result,
            }, this.parentOrigin);
        }

        private get isInitialised() {
            return Security.isLoggedIn && this.hasTransactionData;
        }

        private addEventListeners() {
            window.addEventListener('message', async (event: MessageEvent) => {
                const data = event.data;
                if (data && data.type === EVENT_TYPES.SEND_TRANSACTION_DATA) {
                    this.transactionData = {...data.params};
                    this.parentOrigin = event.origin;
                    this.parentWindow = (event.source as Window);
                    await this.checkGas(this.transactionData);
                    this.hasTransactionData = true;
                }
            }, false);

            window.addEventListener('beforeunload', () => {
                this.parentWindow.postMessage({type: EVENT_TYPES.POPUP_CLOSED}, this.parentOrigin);
            });
        }

        private async checkGas(transactionData: any): Promise<boolean> {
            return Api.getBalance(transactionData.walletId).then((balance: Balance) => {
                if (balance && balance.gasBalance <= 0) {
                    this.$store.dispatch('setBlockingError', 'This wallet has insufficient gas to execute a transaction');
                    return false;
                } else {
                    return true;
                }
            }).catch((result: any) => {
                return true;
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
