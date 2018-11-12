import Utils from '../../utils/Utils';
import {EVENT_TYPES} from '../../types/EventTypes';

export class Signer {

    public static createSigner(bearerTokenProvider: () => string): Signer {
        Signer.destroySigner();
        Signer.signer = new Signer(bearerTokenProvider);
        return Signer.signer;
    }

    public static destroySigner() {
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

        const newWindow = window.open('', title, features);
        if (newWindow) {
            newWindow.location.href = url;
        }
        return newWindow;
    }
    private bearerTokenProvider: () => string;
    private popup: Window;

    private isPopupMounted: boolean = false;
    private eventListeners: { [key: string]: () => void; } = {};


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

    public async executeTransaction(transactionRequest: any) {
        return this.handleTransactionInPopup('execute', transactionRequest);
    }

    public async signTransaction(transactionRequest: any) {
        return this.handleTransactionInPopup('sign', transactionRequest);
    }

    public close() {
        this.popup.close();
        delete this.popup;
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

    public addEventListener(event: string, handleFunction: () => void) {
        this.eventListeners[event] = handleFunction;
    }

    private async handleTransactionInPopup(method: string, transactionRequest: any) {
        this.popup.focus();

        return new Promise((resolve, reject) => {
            const url = `${Utils.urls.connect}/transaction/${method}/${transactionRequest.type}`
                + `?bearerToken=${this.bearerTokenProvider()}${Utils.environment ? '&environment=' + Utils.environment : ''}`;
            this.popup = Signer.openWindow(url) as Window;
            this.onPopupMountedQueue.push(this.attachMessageHandler(resolve, reject));
            this.onPopupMountedQueue.push(this.sendTransactionRequest(transactionRequest));
            this.processPopupMountedQueue();
        });
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

    private processPopupMountedQueue() {
        if (this.isPopupMounted) {
            this.onPopupMountedQueue.forEach((callback: () => void) => callback());
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
}
