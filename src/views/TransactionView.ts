import {Vue} from 'vue-property-decorator';
import {EVENT_TYPES} from '../types/EventTypes';
import ResponseBody from '../api/ResponseBody';
import {State} from 'vuex-class';
import Security from '../Security';
import Api from '../api';
import {Wallet} from '../models/Wallet';
import Component from 'vue-class-component';

declare const window: Window;

@Component({})
export default class TransactionView<TRANSACTION_DATA, TRANSACTION_PREPARATION> extends Vue {

    public loadingText = 'Initializing ...';
    public transactionRequest: TRANSACTION_DATA = {} as TRANSACTION_DATA;
    public transactionPreparation: TRANSACTION_PREPARATION = {} as TRANSACTION_PREPARATION;

    @State
    public transactionWallet?: Wallet;

    @State
    public auth: any;

    @State
    public hasBlockingError!: boolean;

    protected hasTransactionRequest: boolean = false;
    protected onTransactionRequestReceivedCallback?: (transactionRequest: TRANSACTION_DATA) => void;
    protected onTransactionPreparationReceivedCallback?: (transactionPreparation: TRANSACTION_PREPARATION) => void;

    protected transactionPreparationMethod?: (data: TRANSACTION_DATA) => Promise<TRANSACTION_PREPARATION>;
    protected postTransaction: (transactionRequest: any, pincode: string) => Promise<any> = (
        (txData, pincode) => new Promise((resolve, reject) => {
            reject();
        })
    );
    protected onSuccesCallbackHandler?: (result: ResponseBody) => void;

    protected messagePort!: MessagePort;

    private get isInitialised() {
        return Security.isLoggedIn && this.hasTransactionRequest;
    }

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

    public pinEntered(pincode: string) {
        this.$store.dispatch('showModal');
        this.$store.dispatch('startLoading');
        this.postTransaction(this.transactionRequest, pincode)
            .then((r: ResponseBody) => {
                this.$store.dispatch('stopLoading');
                this.$store.dispatch('hideModal');

                if (this.onSuccesCallbackHandler) {
                    this.onSuccesCallbackHandler(r);
                }
            })
            .catch((e: ResponseBody) => {
                this.$store.dispatch('stopLoading');
                this.$store.dispatch('hideModal');

                if (this.responseHasErrors(e)) {
                    if (this.errorsContains(e, 'pincode.incorrect')) {
                        this.$store.dispatch('setError', 'You entered a wrong pincode');
                    } else if (this.errorsContains(e, 'pincode.no-tries-left')) {
                        this.$store.dispatch('setError', 'You entered a wrong pincode too many times');
                    } else if (e.errors) {
                        this.$store.dispatch('setError', e.errors.map((error: any) => error.message)[0]);
                    }
                } else {
                    this.$store.dispatch('setError', 'Something went wrong when submitting your transaction. Please try again. If the problem persists, contact support ' +
                        'via support@arkane.network');
                }
                this.$store.dispatch('triggerClearPincode');
            });
    }

    private responseHasErrors(r: ResponseBody) {
        return (!r.success) && r.errors && r.errors.length > 0;
    }

    private errorsContains(r: ResponseBody, errorCode: string) {
        return r.errors && r.errors.map((error: any) => error.code).includes(errorCode);
    }

    private initMessageChannel() {
        const messageChannel = new MessageChannel();
        this.messagePort = messageChannel.port1;
        this.messagePort.onmessage = this.onMessage;
        window.opener.postMessage({type: EVENT_TYPES.POPUP_MOUNTED}, '*', [messageChannel.port2]);
    }

    private async onMessage(event: MessageEvent) {
        const data = event.data;
        if (data && data.type === EVENT_TYPES.SEND_TRANSACTION_DATA) {
            this.transactionRequest = Object.assign({}, this.transactionRequest, data.params);
            await this.fetchWallet(this.transactionRequest);
            await this.doTransactionPreparation();
            if (this.onTransactionRequestReceivedCallback) {
                this.onTransactionRequestReceivedCallback(this.transactionRequest);
            }
            this.hasTransactionRequest = true;
        }
    }

    private async doTransactionPreparation() {
        if (this.transactionPreparationMethod) {
            const transactionPreparation: TRANSACTION_PREPARATION = await this.transactionPreparationMethod(this.transactionRequest);
            if (transactionPreparation) {
                this.transactionPreparation = Object.assign({}, this.transactionPreparation, transactionPreparation);
                if (this.onTransactionPreparationReceivedCallback) {
                    this.onTransactionPreparationReceivedCallback(transactionPreparation);
                }
            }
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

    private async fetchWallet(transactionRequest: any): Promise<boolean> {
        return Api.getWallet(transactionRequest.walletId)
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
