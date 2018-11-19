import Utils from '../../utils/Utils';
import {EVENT_TYPES} from '../../types/EventTypes';
import ResponseBody from '../../api/ResponseBody';

export class Signer {

    public static createSigner(bearerTokenProvider: () => string): Signer {
        Signer.destroySigner();
        Signer.signer = new Signer(bearerTokenProvider);
        return Signer.signer;
    }

    public static destroySigner(): void {
        if (Signer.signer) {
            Signer.signer.close();
        }
    }

    private static signer: Signer;

    private static openWindow(url: string, title: string = 'Arkane Connect', w: number = 350, h: number = 600) {
        const left = (screen.width / 2) - (w / 2);
        const top = (screen.height / 2) - (h / 2);
        let features = 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, ';
        features += `copyhistory=no, width=${w}, height=${h}, top=${top}, left=${left}`;

        return  window.open(url, title, features);
    }

    private bearerTokenProvider: () => string;
    private popup: Window;

    private isPopupMounted: boolean = false;

    private popupMountedListener?: (message: MessageEvent) => any;

    private messagePort?: MessagePort;

    private onPopupMountedQueue: Array<() => void> = [];

    private constructor(bearerTokenProvider: () => string) {
        this.bearerTokenProvider = bearerTokenProvider;
        const url = `${Utils.urls.connect}/transaction/init`;

        this.popup = Signer.openWindow(url) as Window;
        this.popupMountedListener = this.createPopupMountedListener();
        window.addEventListener('message', this.popupMountedListener);
    }

    public async executeTransaction(transactionRequest: any): Promise<ResponseBody> {
        return this.handleTransactionInPopup('execute', transactionRequest);
    }

    public async signTransaction(transactionRequest: any): Promise<ResponseBody> {
        return this.handleTransactionInPopup('sign', transactionRequest);
    }

    public close() {
        if (this.popup) {
            this.popup.close();
            delete this.popup;
        }
        if (this.messagePort) {
            this.messagePort.close();
            delete this.messagePort;
        }
        if (this.popupMountedListener) {
            window.removeEventListener('message', this.popupMountedListener);
            delete this.popupMountedListener;
        }
        delete Signer.signer;
    }

    private async handleTransactionInPopup(method: string, transactionRequest: any): Promise<ResponseBody> {
        this.popup.focus();

        return new Promise((resolve, reject) => {
            const url = `${Utils.urls.connect}/transaction/${method}/${transactionRequest.type}`
                + `?bearerToken=${this.bearerTokenProvider()}${Utils.environment ? '&environment=' + Utils.environment : ''}`;
            this.goTo(url);
            this.onPopupMountedQueue.push(this.attachMessageHandler(resolve, reject));
            this.onPopupMountedQueue.push(this.sendTransactionRequest(transactionRequest));
            this.processPopupMountedQueue();
        }) as Promise<ResponseBody>;
    }

    private attachMessageHandler(resolve: any, reject: any): () => void {
        return () => {
            if (this.messagePort) {
                this.messagePort.onmessage = this.createMessageHandler(resolve, reject);
            }
        };
    }


    private sendTransactionRequest(transactionRequest: any): () => void {
        return () => {
            if (this.messagePort) {
                this.messagePort.postMessage({type: EVENT_TYPES.SEND_TRANSACTION_DATA, params: transactionRequest});
            }
        };
    }

    private createPopupMountedListener() {
        return (message: MessageEvent) => {
            if (Utils.messages().hasValidOrigin(message) && Utils.messages().isOfType(message, EVENT_TYPES.POPUP_MOUNTED)) {
                this.isPopupMounted = true;
                this.messagePort = message.ports[0];
                if (this.popupMountedListener) {
                    window.removeEventListener('message', this.popupMountedListener);
                    delete this.popupMountedListener;
                }
                this.processPopupMountedQueue();
            }
        };
    }

    /**
     * Queue that get's processed when Popup is mounted
     */
    private processPopupMountedQueue() {
        if (this.isPopupMounted) {
            let callback  = this.onPopupMountedQueue.shift();
            while (callback) {
                callback();
                callback  = this.onPopupMountedQueue.shift();
            }
        }
    }

    private createMessageHandler(resolve: any, reject: any) {
        return (message: MessageEvent) => {
            if (Utils.messages().hasType(message)) {
                this.close();
                switch (message.data.type) {
                    case EVENT_TYPES.TRANSACTION_SIGNED:
                    case EVENT_TYPES.TRANSACTION_EXECUTED:
                        resolve(message.data && {...message.data.data});
                        break;
                    case EVENT_TYPES.POPUP_CLOSED:
                        reject({
                            success: false,
                            errors: ['Popup closed'],
                            result: {},
                        });
                        break;
                }
            }
        };
    }

    private goTo(url: string) {
        this.popup.location.href = url;
    }
}
