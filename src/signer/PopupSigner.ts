import { ConfirmationRequest }       from '../models/ConfirmationRequest';
import { EVENT_TYPES }               from '../types/EventTypes';
import { GenericTransactionRequest } from '../models/transaction/GenericTransactionRequest';
import { GenericSignatureRequest }   from '../models/transaction/GenericSignatureRequest';
import Utils                         from '../utils/Utils';
import { Signer, SignerResult }      from '../signer/Signer';
import { TransactionRequest }        from '..';

export class PopupSigner implements Signer {

    private popup: Popup;
    private bearerTokenProvider: () => string;

    constructor(bearerTokenProvider: () => string) {
        this.bearerTokenProvider = bearerTokenProvider;
        this.popup = new Popup(`${Utils.urls.connect}/popup/transaction/init.html`, this.bearerTokenProvider);
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

class Popup {

    private static openWindow(url: string, title: string = 'Arkane Connect', w: number = 350, h: number = 685) {
        const left = (screen.width / 2) - (w / 2);
        const top = (screen.height / 2) - (h / 2);
        let features = 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, ';
        features += `copyhistory=no, width=${w}, height=${h}, top=${top}, left=${left}`;
        const popup = window.open(url, title, features);
        if (popup) {
            return popup;
        } else {
            throw new Error('Something went wrong while trying to open the signer popup');
        }
    }

    private popup: Window;
    private correlationID: string;
    private bearerTokenProvider: () => string;

    private popupMountedListener?: (message: MessageEvent) => any;
    private signerFinishedListener?: (message: MessageEvent) => any;
    private onPopupMountedQueue: Array<() => void> = [];
    private isPopupMounted: boolean = false;

    constructor(url: string, bearerTokenProvider: () => string) {
        this.correlationID = '' + Date.now() + Math.random();
        this.bearerTokenProvider = bearerTokenProvider;
        this.popupMountedListener = this.createPopupMountedListener(this.correlationID);
        window.addEventListener('message', this.popupMountedListener);
        this.popup = Popup.openWindow(url + '?cid=' + encodeURIComponent(this.correlationID) + '&webURI=' + encodeURIComponent(Utils.urls.connect));
    }

    public isOpen(): boolean {
        return this.popup && !this.popup.closed;
    }

    public close() {
        if (this.popupMountedListener) {
            window.removeEventListener('message', this.popupMountedListener);
        }
        this.popup.close();
    }

    public focus() {
        this.popup.focus();
    }

    public sendData(
        action: string,
        requestData: TransactionRequest | GenericTransactionRequest | GenericSignatureRequest | { transactionId: string } | ConfirmationRequest
    ): Promise<SignerResult> {
        return new Promise((resolve, reject) => {
            this.onPopupMountedQueue.push(this.attachSignerFinishedListener(resolve, reject));
            this.onPopupMountedQueue.push(this.sendRequestDataToPopup(action, requestData));
            this.processPopupMountedQueue();
        }) as Promise<{ status: 'SUCCESS' | 'ABORTED', result?: any, errors?: [] }>;
    }

    private createPopupMountedListener(correlationID: string) {
        return (message: MessageEvent) => {
            if (Utils.messages().hasValidOrigin(message)
                && Utils.messages().hasCorrectCorrelationID(message, correlationID)
                && Utils.messages().isOfType(message, EVENT_TYPES.POPUP_MOUNTED)) {
                this.isPopupMounted = true;
                if (this.popupMountedListener) {
                    window.removeEventListener('message', this.popupMountedListener);
                    delete this.popupMountedListener;
                }
                this.processPopupMountedQueue();
            }
        };
    }

    private attachSignerFinishedListener(resolve: any, reject: any): () => void {
        return () => {
            if (this.signerFinishedListener) {
                window.removeEventListener('message', this.signerFinishedListener);
                delete this.signerFinishedListener;
            }
            this.signerFinishedListener = this.createSignerFinishedListener(resolve, reject);
            window.addEventListener('message', this.signerFinishedListener);
        };
    }

    private sendRequestDataToPopup(
        action: string,
        requestData: TransactionRequest | GenericTransactionRequest | GenericSignatureRequest | { transactionId: string } | ConfirmationRequest
    ): () => void {
        return () => {
            if (this.isOpen()) {
                this.popup.postMessage(
                    {type: EVENT_TYPES.SEND_TRANSACTION_DATA, params: {action, transactionRequest: requestData, bearerToken: this.bearerTokenProvider()}},
                    Utils.urls.connect
                );
            }
        };
    }

    private createSignerFinishedListener(resolve: any, reject: any) {
        return (message: MessageEvent) => {
            if (Utils.messages().hasValidOrigin(message)
                && Utils.messages().isOfType(message, EVENT_TYPES.SIGNER_FINISHED)
                && Utils.messages().hasCorrectCorrelationID(message, this.correlationID)) {
                switch (message.data.result.status) {
                    case 'SUCCESS':
                        resolve(message.data && {...message.data.result});
                        break;
                    case 'ABORTED':
                        reject(message.data && {...message.data.result});
                        break;
                    case 'FAILED':
                        reject(message.data && {...message.data.result});
                        break;
                }
            }
        };
    }

    /**
     * Process onPopupMountedQueue when popup is mounted
     */
    private processPopupMountedQueue() {
        if (this.isPopupMounted) {
            let callback = this.onPopupMountedQueue.shift();
            while (callback) {
                callback();
                callback = this.onPopupMountedQueue.shift();
            }
        }
    }
}
