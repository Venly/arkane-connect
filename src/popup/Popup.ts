import { PopupResult } from './PopupResult';
import { PopupWindow } from './PopupWindow';
import { EventTypes }  from '../types/EventTypes';
import Utils           from '../utils/Utils';

export default abstract class Popup {
    private static popupIntervals: number[] = [];

    private static clearPopupIntervals() {
        // Make sure, all intervals are cleared;
        Popup.popupIntervals.forEach((v: number, i: number) => {
            clearInterval(Popup.popupIntervals[i]);
        });
        Popup.popupIntervals = [];
    }

    protected popupMountedListener?: (message: MessageEvent) => any;
    protected finishedListener?: (message: MessageEvent) => any;
    protected onPopupMountedQueue: Array<() => void> = [];
    protected isPopupMounted: boolean = false;
    protected useOverlay: boolean = true;

    protected popupWindow: PopupWindow;
    protected correlationID: string;
    protected readonly bearerTokenProvider: () => string;

    protected abstract finishedEventType: EventTypes;
    protected abstract sendDataEventType: EventTypes;

    constructor(url: string, bearerTokenProvider: () => string, options?: PopupOptions) {
        this.useOverlay = (options && typeof options.useOverlay !== 'undefined') ? options.useOverlay : true;
        this.correlationID = '' + Date.now() + Math.random();
        this.bearerTokenProvider = bearerTokenProvider;
        this.popupMountedListener = this.createPopupMountedListener(this.correlationID);
        window.addEventListener('message', this.popupMountedListener);
        url = Utils.http().addRequestParams(url, {cid: this.correlationID, webURI: Utils.urls.connect});
        this.popupWindow = PopupWindow.openNew(url, {useOverlay: this.useOverlay});
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

    protected attachFinishedListener(resolve: (value?: any) => void, reject: (reason?: any) => void): () => void {
        return () => {
            Popup.clearPopupIntervals();
            if (this.finishedListener) {
                window.removeEventListener('message', this.finishedListener);
                delete this.finishedListener;
            }
            Popup.popupIntervals.push(this.createPopupClosedListener(reject));
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

    protected createPopupClosedListener(reject: (reason?: any) => void) {
        return window.setInterval(() => {
            if (!this.popupWindow || this.popupWindow.closed) {
                Popup.clearPopupIntervals();
                reject({status: 'ABORTED', errors: []});
            }
        }, 100);
    }

    protected createFinishedListener(resolve: (value?: any) => void, reject: (reason?: any) => void) {
        return (message: MessageEvent) => {
            if (Utils.messages().hasValidOrigin(message)
                && Utils.messages().isOfType(message, this.finishedEventType)
                && Utils.messages().hasCorrectCorrelationID(message, this.correlationID)) {
                // Finished handler will take cre of popup closing
                Popup.clearPopupIntervals();
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

export interface PopupOptions {
    useOverlay: boolean
}
