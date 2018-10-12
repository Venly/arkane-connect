import {Vue} from 'vue-property-decorator';
import {EVENT_TYPES} from '../../types/EventTypes';
import ResponseBody from '../../api/ResponseBody';
import {State} from 'vuex-class';
import Security from '../../Security';
import Api from '../../api';
import {Wallet} from '../../models/Wallet';
import Component from 'vue-class-component';

declare const window: Window;

@Component({
})
export default class SignTransactionView extends Vue {

    private get isInitialised() {
        return Security.isLoggedIn && this.hasTransactionData;
    }
    public loadingText = 'Initializing signer ...';

    public transactionData!: any;
    public errorText = '';

    @State
    public auth: any;

    protected onTransactionDataReceivedCallback?: (transactionData: any) => void;

    private parentWindow!: Window;
    private parentOrigin!: string;
    private hasTransactionData: boolean = false;
    private messagePort!: MessagePort;

    public created() {
        if (!this.auth) {
            this.loadingText = 'Not authenticated, going back in 3 seconds.';
            setTimeout(() => {
                (window as any).close();
            }, 3000);
        }
    }

    public mounted() {
        this.initMessageChannel();
        this.addEventListeners();
    }

    public noTriesLeftMessage() {
        this.errorText = 'You entered a wrong pincode too many times.';
    }

    public wrongPincodeMessage() {
        this.errorText = 'Wrong pincode';
    }

    private sendTransactionSignedMessage(result: ResponseBody) {
        this.parentWindow.postMessage({
                                          type: EVENT_TYPES.TRANSACTION_SIGNED,
                                          data: result,
                                      }, this.parentOrigin);
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
            if (this.onTransactionDataReceivedCallback) {
                this.onTransactionDataReceivedCallback(this.transactionData);
            }
            this.hasTransactionData = true;
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
