import { ConfirmationRequest }       from '../models/ConfirmationRequest';
import { EVENT_TYPES }               from '../types/EventTypes';
import { GenericTransactionRequest } from '../models/transaction/GenericTransactionRequest';
import { GenericSignatureRequest }   from '../models/transaction/GenericSignatureRequest';
import Utils                         from '../utils/Utils';
import { Signer, SignerResult }      from '../signer/Signer';
import { TransactionRequest }        from '..';
import Popup                         from '../popup/Popup';

export class PopupSigner implements Signer {

    private popup: PopupSignerPopup;
    private bearerTokenProvider: () => string;

    constructor(bearerTokenProvider: () => string) {
        this.bearerTokenProvider = bearerTokenProvider;
        this.popup = new PopupSignerPopup(`${Utils.urls.connect}/popup/transaction/init.html`, this.bearerTokenProvider);
        window.addEventListener('beforeunload', () => {
            this.closePopup();
        });
    }

    public closePopup() {
        this.popup.close();
    }

    public async sign(signatureRequest: GenericSignatureRequest): Promise<SignerResult> {
        signatureRequest.hash = typeof signatureRequest.hash === 'undefined' ? true : signatureRequest.hash;
        signatureRequest.prefix = typeof signatureRequest.hash === 'undefined' ? true : signatureRequest.prefix;
        return this.handleRequest('sign', signatureRequest);
    }

    /** Deprecated since 1.1.9. Use sign instead */
    public async signTransaction(signatureRequest: GenericSignatureRequest): Promise<SignerResult> {
        return this.sign(signatureRequest);
    }

    public async executeNativeTransaction(transactionRequest: TransactionRequest): Promise<SignerResult> {
        return this.handleRequest('execute', transactionRequest);
    }

    public async executeTransaction(genericTransactionRequestOrTransactionId: GenericTransactionRequest | string): Promise<SignerResult> {
        if (typeof genericTransactionRequestOrTransactionId === 'string') {
            const transactionId: string = genericTransactionRequestOrTransactionId;
            return this.handleRequest('execute', {transactionId});
        } else {
            const transactionRequest: GenericTransactionRequest = genericTransactionRequestOrTransactionId;
            return this.handleRequest('execute', transactionRequest);
        }
    }

    public async confirm(request: ConfirmationRequest): Promise<SignerResult> {
        this.popup.focus();
        return this.handleRequest('confirm', request);
    }

    private async handleRequest(
        action: string,
        requestData: TransactionRequest | GenericTransactionRequest | GenericSignatureRequest | { transactionId: string } | ConfirmationRequest
    ): Promise<SignerResult> {
        this.popup.focus();
        return this.popup
                   .sendData(action, Object.assign({}, requestData))
                   .finally(() => {
                       this.closePopup()
                   });
    }
}

class PopupSignerPopup extends Popup {

    protected finishedEventType = EVENT_TYPES.SIGNER_FINISHED;
    protected sendDataEventType = EVENT_TYPES.SEND_TRANSACTION_DATA;

    constructor(url: string, bearerTokenProvider: () => string) {
        super(url, bearerTokenProvider);
    }

    public sendData(
        action: string,
        requestData: TransactionRequest | GenericTransactionRequest | GenericSignatureRequest | { transactionId: string } | ConfirmationRequest
    ): Promise<SignerResult> {
        return new Promise((resolve, reject) => {
            this.onPopupMountedQueue.push(this.attachFinishedListener(resolve, reject));
            this.onPopupMountedQueue.push(this.sendDataToPopup(action, requestData));
            this.processPopupMountedQueue();
        }) as Promise<SignerResult>;
    }

    protected sendDataToPopup(
        action: string,
        requestData: TransactionRequest | GenericTransactionRequest | GenericSignatureRequest | { transactionId: string } | ConfirmationRequest
    ): () => void {
        return () => {
            if (this.isOpen()) {
                this.popupWindow.postMessage(
                    {type: this.sendDataEventType, params: {action, transactionRequest: requestData, bearerToken: this.bearerTokenProvider()}},
                    Utils.urls.connect
                );
            }
        };
    }
}
