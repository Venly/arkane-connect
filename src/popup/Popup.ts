import Utils           from '../utils/Utils';
import { EVENT_TYPES } from '../types/EventTypes';
import { PopupResult } from './PopupResult';

export default abstract class Popup {

    protected popupMountedListener?: (message: MessageEvent) => any;
    protected finishedListener?: (message: MessageEvent) => any;
    protected onPopupMountedQueue: Array<() => void> = [];
    protected isPopupMounted: boolean = false;

    protected popupWindow: Window;
    protected correlationID: string;
    protected readonly bearerTokenProvider: () => string;

    protected abstract finishedEventType: EVENT_TYPES;
    protected abstract sendDataEventType: EVENT_TYPES;

    constructor(url: string, bearerTokenProvider: () => string) {
        this.correlationID = '' + Date.now() + Math.random();
        this.bearerTokenProvider = bearerTokenProvider;
        this.popupMountedListener = this.createPopupMountedListener(this.correlationID);
        window.addEventListener('message', this.popupMountedListener);
        url = Utils.http().addRequestParams(url, {cid: this.correlationID, webURI: Utils.urls.connect});
        this.popupWindow = Popup.openWindow(url);
    }

    public abstract sendData(action: string, data: any): Promise<PopupResult>;

    protected abstract sendDataToPopup(action: string, data: any): void;

    public isOpen(): boolean {
        return this.popupWindow && !this.popupWindow.closed;
    }

    public close() {
        if (this.popupMountedListener) {
            window.removeEventListener('message', this.popupMountedListener);
        }
        this.popupWindow.close();
    }

    public focus() {
        this.popupWindow.focus();
    }

    protected attachFinishedListener(resolve: any, reject: any): () => void {
        return () => {
            if (this.finishedListener) {
                window.removeEventListener('message', this.finishedListener);
                delete this.finishedListener;
            }
            this.finishedListener = this.createFinishedListener(resolve, reject);
            window.addEventListener('message', this.finishedListener);
        };
    }

    protected createPopupMountedListener(correlationID: string) {
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

    protected createFinishedListener(resolve: any, reject: any) {
        return (message: MessageEvent) => {
            if (Utils.messages().hasValidOrigin(message)
                && Utils.messages().isOfType(message, this.finishedEventType)
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
    protected processPopupMountedQueue() {
        if (this.isPopupMounted) {
            let callback = this.onPopupMountedQueue.shift();
            while (callback) {
                callback();
                callback = this.onPopupMountedQueue.shift();
            }
        }
    }

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
}
