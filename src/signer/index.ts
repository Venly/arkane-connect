import { GenericTransactionRequest }            from '../models/transaction/GenericTransactionRequest';
import { SignerHandler, SignerHandlerResolver } from './SignerHandler';
import { PopupSignerHandler }                   from '../signer/PopupSignerHandler';


export class Signer {

    private bearerTokenProvider: () => string;
    private signUsing: SignMethod;
    private signerHandler: SignerHandler;

    constructor(bearerTokenProvider: () => string, options?: { signUsing?: SignMethod }) {
        this.bearerTokenProvider = bearerTokenProvider;
        this.signerHandler = SignerHandlerResolver.createSignerHandlerFor((options && options.signUsing) || SignMethod.POPUP, bearerTokenProvider);
        this.signUsing = (options && options.signUsing) || SignMethod.POPUP;
    }

    public async executeTransaction(transactionRequest: GenericTransactionRequest, options?: any): Promise<SignerResult> {
        return this.signerHandler.executeTransaction(transactionRequest, options);
    }

    public async executeNativeTransaction(transactionRequest: any, options?: any): Promise<SignerResult> {
        return this.signerHandler.executeNativeTransaction(transactionRequest, options);
    }

    public async signTransaction(transactionRequest: any, options?: any): Promise<SignerResult> {
        return this.signerHandler.signTransaction(transactionRequest, options);
    }

    public openPopup() {
        if (this.isPopupSignerHandler(this.signerHandler)) {
            this.signerHandler.openPopup();
        } else {
            throw new Error(
                'The signer is configured to be opened via a redirect. To open the signer in a popup, pass {signUsing: \'POPUP\'} as option when calling the ArkaneConnect constructor');
        }
    }

    public closePopup() {
        if (this.isPopupSignerHandler(this.signerHandler)) {
            this.signerHandler.closePopup();
        } else {
            throw new Error(
                'The signer is configured to be opened via a redirect. To open the signer in a popup, pass {signUsing: \'POPUP\'} as option when calling the ArkaneConnect constructor');
        }
    }

    private isPopupSignerHandler(signerHandler: SignerHandler): signerHandler is PopupSignerHandler {
        return (<PopupSignerHandler>this.signerHandler).openPopup !== undefined && (<PopupSignerHandler>this.signerHandler).closePopup !== undefined;
    }
}

export enum SignMethod {
    POPUP = 'POPUP',
    REDIRECT = 'REDIRECT',
}


export interface SignerResult {
    status: 'SUCCESS' | 'ABORTED',
    result?: any,
    errors?: []
}
