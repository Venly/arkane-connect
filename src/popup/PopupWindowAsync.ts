import Utils                              from '../utils/Utils';
import { EventTypes }                     from '../types/EventTypes';
import { OpenWindowOptions, PopupWindow } from './PopupWindow';

export class PopupWindowAsync {

    public static async openNew(url: string,
                                correlationID: string,
                                options?: OpenWindowOptions): Promise<PopupWindowAsync> {
        const mergedOptions = Object.assign({
            title: 'Venly Connect',
            w: 350,
            h: 685,
            useOverlay: true
        }, options);
        const left = (screen.width / 2) - (mergedOptions.w / 2);
        const top = (screen.height / 2) - (mergedOptions.h / 2);
        const features = 'popup=true, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, '
            + `width=${mergedOptions.w}, height=${mergedOptions.h}, top=${top}, left=${left}`;
        url = Utils.http().addRequestParams(url, {cid: correlationID});
        const popupWindow = new PopupWindowAsync(url, mergedOptions.title, features, mergedOptions.useOverlay, correlationID);
        await popupWindow.open();
        return popupWindow;
    }

    private readonly id: string;
    private readonly url: string;
    private readonly target: string;
    private readonly features: string;
    private readonly useOverlay: boolean;
    private readonly correlationID: string;
    private readonly replace?: boolean;

    private win?: Window | null;
    private popupMountedListener?: (message: MessageEvent) => any;
    private closeInterval?: number;


    private constructor(url: string,
                        target: string,
                        features: string,
                        useOverlay: boolean,
                        correlationId: string,
                        replace?: boolean) {
        this.id = `id-${Utils.uuidv4()}`;
        this.url = url;
        this.target = target;
        this.features = features;
        this.useOverlay = typeof useOverlay !== 'undefined' ? useOverlay : true;
        this.correlationID = correlationId;
        this.replace = replace;
        this.openOverlay();
    }

    private async open() {
        this.win = await new Promise((resolve: (value?: Window) => void) => {
            this.popupMountedListener = this.createPopupMountedListener(this.correlationID, resolve);
            window.addEventListener('message', this.popupMountedListener);
            try {
                console.debug('Opening popup');
                window.open(this.url, this.target, this.features);
            } catch (e) {
                console.debug('popup open failed', e);
            }
        }).then(win => {
            this.setCloseInterval();
            return win;
        });
    }

    private createPopupMountedListener(correlationID: string, resolve: (value?: Window) => void) {
        return (message: MessageEvent) => {
            console.debug('Message:', message);
            if (Utils.messages().hasValidOrigin(message)
                && Utils.messages().hasCorrectCorrelationID(message, correlationID)
                && Utils.messages().isOfType(message, EventTypes.POPUP_MOUNTED)) {
                if (this.popupMountedListener) {
                    window.removeEventListener('message', this.popupMountedListener);
                    delete this.popupMountedListener;
                }
                resolve((message.source as Window));
            }
        };
    }

    private setCloseInterval() {
        this.closeInterval = window.setInterval(() => {
            if (!this.win || this.win.closed) {
                this.clearCloseInterval();
                this.close();
            }
        }, 100);
    }

    private clearCloseInterval() {
        window.clearInterval(this.closeInterval);
    }

    public close() {
        if (this.win) {
            this.win.close();
        }
        this.closeOverlay();
    }

    public get closed(): boolean {
        if (this.win) {
            return this.win.closed;
        } else {
            return true;
        }
    }

    public focus() {
        if (this.win) {
            this.win.focus();
        }
    }

    private closeOverlay(): void {
        PopupWindow.closeOverlay(this.id, this.useOverlay);
    }

    private openOverlay(): void {
        PopupWindow.openOverlay(this.id, this.useOverlay, this.focus, this.close);
    }
}
