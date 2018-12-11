import ResponseBody                                       from '../api/ResponseBody';
import { GenericTransactionRequest }                      from '../models/transaction/GenericTransactionRequest';
import { TransactionHandler, TransactionHandlerResolver } from './TransactionHandler';
import { PopupTransactionHandler }                        from '../signer/PopupTransactionHandler';


export default class Signer {


    private bearerTokenProvider: () => string;
    private signUsing: SignMethod;
    private transactionHandler: TransactionHandler;

    constructor(bearerTokenProvider: () => string, options?: { signUsing?: SignMethod }) {
        this.bearerTokenProvider = bearerTokenProvider;
        this.transactionHandler = TransactionHandlerResolver.createTransactionHandlerFor((options && options.signUsing) || SignMethod.POPUP, bearerTokenProvider);
        this.signUsing = (options && options.signUsing) || SignMethod.POPUP;
    }

    public async executeTransaction(transactionRequest: GenericTransactionRequest, options?: any): Promise<ResponseBody> {
        return this.transactionHandler.executeTransaction(transactionRequest, options);
    }

    public async executeNativeTransaction(transactionRequest: any, options?: any): Promise<ResponseBody> {
        return this.transactionHandler.executeNativeTransaction(transactionRequest, options);
    }

    public async signTransaction(transactionRequest: any, options?: any): Promise<ResponseBody> {
        return this.transactionHandler.signTransaction(transactionRequest, options);
    }

    public openPopup() {
        if (this.isPopupTransactionHandler(this.transactionHandler)) {
            this.transactionHandler.openPopup();
        } else {
            throw new Error(
                'The signer is configured to be opened via a redirect. To open the signer in a popup, pass {signUsing: \'POPUP\'} as option when calling the ArkaneConnect constructor');
        }
    }

    public closePopup() {
        if (this.isPopupTransactionHandler(this.transactionHandler)) {
            this.transactionHandler.closePopup();
        } else {
            throw new Error(
                'The signer is configured to be opened via a redirect. To open the signer in a popup, pass {signUsing: \'POPUP\'} as option when calling the ArkaneConnect constructor');
        }
    }

    private isPopupTransactionHandler(transactionHandler: TransactionHandler): transactionHandler is PopupTransactionHandler {
        return (<PopupTransactionHandler>this.transactionHandler).openPopup !== undefined && (<PopupTransactionHandler>this.transactionHandler).closePopup !== undefined;
    }
}

export enum SignMethod {
    POPUP = 'POPUP',
    REDIRECT = 'REDIRECT',
}
