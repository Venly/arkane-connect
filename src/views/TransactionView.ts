import {Vue} from 'vue-property-decorator';
import {EVENT_TYPES} from '../types/EventTypes';
import ResponseBody from '../api/ResponseBody';
import {State} from 'vuex-class';
import Security from '../Security';
import Api from '../api';
import {Wallet} from '../models/Wallet';
import Component from 'vue-class-component';
import EthereumTransactionPreparationDto from '@/models/transaction/preparation/ethereum/EthereumTransactionPreparationDto';
import VeChainTransactionPreparationDto from '@/models/transaction/preparation/vechain/VeChainTransactionPreparationDto';

declare const window: Window;

@Component({})
export default class TransactionView<TRANSACTION_DATA, TRANSACTION_PREPARATION> extends Vue {

    public loadingText = 'Initializing ...';
    public transactionData: TRANSACTION_DATA = {} as TRANSACTION_DATA;
    public transactionPreparation: TRANSACTION_PREPARATION = {} as TRANSACTION_PREPARATION;

    @State
    public transactionWallet?: Wallet;
    @State
    public auth: any;
    @State
    public hasBlockingError!: boolean;

    protected hasTransactionData: boolean = false;
    protected onTransactionDataReceivedCallback?: (transactionData: TRANSACTION_DATA) => void;
    protected onTransactionPreparationReceivedCallback?: (transactionPreparation: TRANSACTION_PREPARATION) => void;

    protected transactionPreparationMethod?: (data: TRANSACTION_DATA) => Promise<TRANSACTION_PREPARATION>;
    protected postTransaction: (transactionData: any, pincode: string) => Promise<any> = (
        (txData, pincode) => new Promise((resolve, reject) => {
            reject();
        })
    );
    protected onSuccesCallbackHandler?: (result: ResponseBody) => void;

    protected messagePort!: MessagePort;

    private get isInitialised() {
        return Security.isLoggedIn && this.hasTransactionData;
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
        this.postTransaction(this.transactionData, pincode)
            .then((r: ResponseBody) => {
                this.$store.dispatch('stopLoading');
                this.$store.dispatch('hideModal');
                if (this.responseHasErrors(r)) {
                    if (this.errorsContains(r, 'pincode.incorrect')) {
                        this.$store.dispatch('setError', 'Wrong pincode');
                    } else if (this.errorsContains(r, 'pincode.no-tries-left')) {
                        this.$store.dispatch('setError', 'You entered a wrong pincode too many times');
                    } else {
                        this.$store.dispatch('setError', r.result.errors.map((error: any) => error.message)[0]);
                    }
                } else {
                    if (this.onSuccesCallbackHandler) {
                        this.onSuccesCallbackHandler(r);
                    }
                }
            })
            .catch((e: Error) => {
                this.$store.dispatch('stopLoading');
                this.$store.dispatch('hideModal');
                this.$store.dispatch('setError', 'Something went wrong when submitting your transaction. Please try again. If the problem persists, contact support ' +
                    'via support@arkane.network');
            });
    }

    private responseHasErrors(r: ResponseBody) {
        return (!r.success) && r.result && r.result.errors && r.result.errors.length > 0;
    }

    private errorsContains(r: ResponseBody, errorCode: string) {
        return r.result.errors.map((error: any) => error.code).includes(errorCode);
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
            this.transactionData = Object.assign({}, this.transactionData, data.params);
            await this.fetchWallet(this.transactionData);
            await this.doTransactionPreparation();
            if (this.onTransactionDataReceivedCallback) {
                this.onTransactionDataReceivedCallback(this.transactionData);
            }
            this.hasTransactionData = true;
        }
    }

    private async doTransactionPreparation() {
        if (this.transactionPreparationMethod) {
            const transactionPreparation: TRANSACTION_PREPARATION = await this.transactionPreparationMethod(this.transactionData);
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
