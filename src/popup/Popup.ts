import Utils           from '../utils/Utils';
import { EventTypes } from '../types/EventTypes';
import { PopupResult } from './PopupResult';
import { PopupUtils }  from './PopupUtils';

export default abstract class Popup {

    protected popupMountedListener?: (message: MessageEvent) => any;
    protected finishedListener?: (message: MessageEvent) => any;
    protected onPopupMountedQueue: Array<() => void> = [];
    protected isPopupMounted: boolean = false;

    protected popupWindow: Window;
    protected correlationID: string;
    protected readonly bearerTokenProvider: () => string;

    protected abstract finishedEventType: EventTypes;
    protected abstract sendDataEventType: EventTypes;

    constructor(url: string, bearerTokenProvider: () => string) {
        this.correlationID = '' + Date.now() + Math.random();
        this.bearerTokenProvider = bearerTokenProvider;
        this.popupMountedListener = this.createPopupMountedListener(this.correlationID);
        window.addEventListener('message', this.popupMountedListener);
        url = Utils.http().addRequestParams(url, {cid: this.correlationID, webURI: Utils.urls.connect});
        this.popupWindow = PopupUtils.openWindow(url);
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
                && Utils.messages().isOfType(message, EventTypes.POPUP_MOUNTED)) {
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
}
