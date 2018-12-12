import { TransactionHandler }        from './TransactionHandler';
import ResponseBody                  from '../api/ResponseBody';
import { GenericTransactionRequest } from '../models/transaction/GenericTransactionRequest';
import { EVENT_TYPES }               from '../types/EventTypes';
import Utils                         from '../utils/Utils';

export class PopupTransactionHandler implements TransactionHandler {

    private popup?: Popup;
    private bearerTokenProvider: () => string;

    constructor(bearerTokenProvider: () => string) {
        this.bearerTokenProvider = bearerTokenProvider;
    }

    public openPopup() {
        if (this.popup) {
            this.closePopup();
        }
        this.popup = new Popup(`${Utils.urls.connectWeb}/popup/transaction/init.html`, this.bearerTokenProvider);
    }

    public closePopup() {
        if (this.popup) {
            this.popup.close();
            delete this.popup;
        }
    }

    public async signTransaction(transactionRequest: any): Promise<ResponseBody> {
        return this.handleTransaction('sign', transactionRequest);
    }

    public async executeNativeTransaction(transactionRequest: any): Promise<ResponseBody> {
        return this.handleTransaction('execute', transactionRequest);
    }

    public async executeTransaction(transactionRequest: GenericTransactionRequest): Promise<ResponseBody> {
        return this.handleTransaction('execute', transactionRequest);
    }

    private async handleTransaction(action: string, transactionRequest: any): Promise<ResponseBody> {
        if (!this.popup) {
            console.error('\'openPopup()\' should be called first (if triggered by an event, do this on the first line of your event handler)!');
            return Promise.reject('\'openPopup()\' should be called first (if triggered by an event, do this on the first line of your event handler)!');
        } else {
            this.popup.focus();
            return this.popup
                       .sendTransactionData(action, transactionRequest)
                       .finally(() => {
                           this.closePopup()
                       });
        }
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
    private transactionFinishedListener?: (message: MessageEvent) => any;
    private onPopupMountedQueue: Array<() => void> = [];
    private isPopupMounted: boolean = false;

    constructor(url: string, bearerTokenProvider: () => string) {
        this.correlationID = '' + Date.now() + Math.random();
        this.bearerTokenProvider = bearerTokenProvider;
        this.popupMountedListener = this.createPopupMountedListener(this.correlationID);
        window.addEventListener('message', this.popupMountedListener);
        this.popup = Popup.openWindow(url + '?cid=' + encodeURIComponent(this.correlationID) + '&webURI=' + encodeURIComponent(Utils.urls.connectWeb));
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

    public sendTransactionData(action: string, transactionRequest: any): Promise<ResponseBody> {
        return new Promise((resolve, reject) => {
            this.onPopupMountedQueue.push(this.attachTransactionFinishedListener(resolve, reject));
            this.onPopupMountedQueue.push(this.sendTransactionRequest(action, transactionRequest));
            this.processPopupMountedQueue();
        }) as Promise<ResponseBody>;
    }

    private createPopupMountedListener(correlationID: string) {
        return (message: MessageEvent) => {
            if (Utils.messages().hasValidOrigin(message)
                && Utils.messages().hasCorrectCorrelationID(message, this.correlationID)
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

    private attachTransactionFinishedListener(resolve: any, reject: any): () => void {
        return () => {
            if (this.transactionFinishedListener) {
                window.removeEventListener('message', this.transactionFinishedListener);
                delete this.transactionFinishedListener;
            }
            this.transactionFinishedListener = this.createTransactionFinishedListener(resolve, reject);
            window.addEventListener('message', this.transactionFinishedListener);
        };
    }

    private sendTransactionRequest(action: string, transactionRequest: any): () => void {
        return () => {
            if (this.popup) {
                this.popup.postMessage(
                    {type: EVENT_TYPES.SEND_TRANSACTION_DATA, params: {action, transactionRequest, bearerToken: this.bearerTokenProvider()}},
                    Utils.urls.connectWeb
                );
            }
        };
    }

    private createTransactionFinishedListener(resolve: any, reject: any) {
        return (message: MessageEvent) => {
            if (Utils.messages().hasValidOrigin(message)
                && Utils.messages().hasCorrectCorrelationID(message, this.correlationID)
                && Utils.messages().isOfType(message, EVENT_TYPES.SIGNER_FINISHED)) {
                // TODO 'close' callback
                // this.popup.close();
                switch (message.data.result.status) {
                    case 'SUCCESS':
                        resolve(message.data && {...message.data.result});
                        break;
                    case 'ABORTED':
                        reject({
                            canceledByUser: true,
                            success: false,
                            errors: ['Popup closed'],
                            result: {},
                        });
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
