<template>
  <div class="home">
    <div v-if="isInitialized">
      <div class="logo-wrapper">
        <img class="logo" alt="Arkane Logo" src="../assets/logo-arkane-animated.svg"/>
        <p>{{errorText}}</p>
      </div>
      <numpad :title="'Enter your pincode to sign this transaction'"
              :params="params"
              @signed="sendTransactionSignedMessage"></numpad>
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

    declare const window: Window;

    @Component({
        components: {
            Numpad,
        },
    })
    export default class SignTransactionView extends Vue {
        public loadingText = 'Initializing signer ...';
        public params?: any;
        public errorText = '';


        @State
        public auth: any;

        private isEventSet = false;
        private event!: MessageEvent;

        public created() {
            if (this.auth) {
                this.addEventListeners();
            } else {
                this.loadingText = 'Not authenticated, going back in 3 seconds.';
                setTimeout(() => {
                    (window as any).close();
                }, 3000);
            }
        }


        public noTriesLeftMessage() {
            this.errorText = 'You entered a wrong pincode too many times.';
        }

        public wrongPincodeMessage() {
            this.errorText = 'Wrong pincode';
        }


        public sendTransactionSignedMessage(result: ResponseBody) {
            (this.event.source as Window).postMessage({
                type: EVENT_TYPES.TRANSACTION_SIGNED,
                data: result,
            }, this.event.origin);
        }

        private get isInitialized() {
            return Security.isLoggedIn && this.isEventSet;
        }

        private addEventListeners() {
            window.addEventListener('message', (event: MessageEvent) => {
                if (!this.isEventSet) {
                    const data = event.data;
                    if (data && data.type === EVENT_TYPES.SEND_PARAMS) {
                        this.params = {...data.params};
                        this.event = event;
                        this.isEventSet = true;
                    }
                }
            }, false);
            window.addEventListener('beforeunload', () => {
                (this.event.source as Window).postMessage({
                    type: EVENT_TYPES.POPUP_CLOSED,
                }, this.event.origin);
            });
        }
    }
</script>

<style lang='sass' scoped>
  .logo-wrapper
    padding-bottom: 5px
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
