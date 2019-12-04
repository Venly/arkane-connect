import Utils           from '../utils/Utils';
import { EventTypes }  from '../types/EventTypes';
import { PopupResult } from './PopupResult';
import { PopupUtils }  from './PopupUtils';

export default abstract class Popup {
    private static CONST = {
        overlayClassName: 'arkane-connect__overlay',
        overlayLinkClassName: 'arkane-connect__reopen-link',
        overlayCloseLinkClassName: 'arkane-connect__close-link',
        overlayMessage: 'Don’t see the popup? We’ll help you re-open the popup to complete your action.',
        overlayLinkMessage: 'Click to continue',
        overlayLinkStyle: 'color: white; text-decoration: underline; font-weight: bold;',
    };
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

    protected popupWindow: Window;
    protected correlationID: string;
    protected readonly bearerTokenProvider: () => string;

    protected abstract finishedEventType: EventTypes;
    protected abstract sendDataEventType: EventTypes;

    constructor(url: string, bearerTokenProvider: () => string, useOverlay: boolean = true) {
        this.useOverlay = useOverlay;
        this.correlationID = '' + Date.now() + Math.random();
        this.bearerTokenProvider = bearerTokenProvider;
        this.popupMountedListener = this.createPopupMountedListener(this.correlationID);
        window.addEventListener('message', this.popupMountedListener);
        url = Utils.http().addRequestParams(url, {cid: this.correlationID, webURI: Utils.urls.connect});
        this.popupWindow = PopupUtils.openWindow(url);
        this.addOverlay();
    }

    public abstract sendData(action: string, data: any): Promise<PopupResult>;

    protected abstract sendDataToPopup(action: string, data: any): void;

    public isOpen(): boolean {
        return this.popupWindow && !this.popupWindow.closed;
    }

    public addOverlay(): void {
        if (this.useOverlay) {
            this.removeOverlay();
            const overlayDiv: HTMLDivElement = document.createElement('div');
            overlayDiv.classList.add(Popup.CONST.overlayClassName);
            overlayDiv.style.zIndex = '2147483647';
            overlayDiv.style.display = 'flex';
            overlayDiv.style.alignItems = 'center';
            overlayDiv.style.justifyContent = 'center';
            overlayDiv.style.textAlign = 'center';
            overlayDiv.style.position = 'fixed';
            overlayDiv.style.left = '0px';
            overlayDiv.style.right = '0px';
            overlayDiv.style.top = '0px';
            overlayDiv.style.bottom = '0px';
            overlayDiv.style.background = 'rgba(0,0,0,0.80)';
            overlayDiv.style.color = 'white';
            overlayDiv.style.border = '2px solid #f1f1f1';
            overlayDiv.innerHTML = `<div style="max-width: 350px;">` +
                `<div style="margin-bottom: 1rem">${Popup.CONST.overlayMessage}</div>` +
                `<div><a style="${Popup.CONST.overlayLinkStyle}" href="javascript:void(0)" class="${Popup.CONST.overlayLinkClassName}">${Popup.CONST.overlayLinkMessage}</a></div>` +
                `<a style="${Popup.CONST.overlayLinkStyle} position: absolute; right: 1rem; top: 1rem;" href="javascript:void(0)" class="${Popup.CONST.overlayCloseLinkClassName}">X</a>` +
                `</div>`;
            document.body.appendChild(overlayDiv);
            const link = overlayDiv.querySelector(`.${Popup.CONST.overlayLinkClassName}`);
            const closeLink = overlayDiv.querySelector(`.${Popup.CONST.overlayCloseLinkClassName}`);
            if (link) {
                link.addEventListener('click', () => {
                    this.focus();
                });
            }
            if(closeLink) {
                closeLink.addEventListener('click', () => {
                    this.close();
                })
            }
        }
    }

    public removeOverlay(): void {
        if(this.useOverlay) {
            const overlays = document.querySelectorAll(`.${Popup.CONST.overlayClassName}`);
            for (let j = overlays.length - 1; j >= 0; j--) {
                let overlayParent = overlays[j].parentNode;
                overlayParent ? overlayParent.removeChild(overlays[j]) : null;
            }
        }
    }

    public close() {
        if (this.popupMountedListener) {
            window.removeEventListener('message', this.popupMountedListener);
        }
        this.removeOverlay();
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
                this.removeOverlay();
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
