import Utils from '../utils/Utils';

export class PopupWindow {
    private static CONST = {
        overlayClassName: 'venly-connect__overlay',
        overlayLinkClassName: 'venly-connect__reopen-link',
        overlayCloseLinkClassName: 'venly-connect__close-link',
        overlayMessage: 'Don’t see the popup? We’ll help you re-open the popup to complete your action.',
        overlayLinkMessage: 'Click to continue',
        overlayLinkStyle: 'color: white; text-decoration: underline; font-weight: bold;',
    };

    public static openNew(url: string,
                          options?: OpenWindowOptions): PopupWindow {
        const mergedOptions = Object.assign({
            title: 'Venly Connect',
            w: 350,
            h: 685,
            useOverlay: true
        }, options);
        const left = (screen.width / 2) - (mergedOptions.w / 2);
        const top = (screen.height / 2) - (mergedOptions.h / 2);
        let features = 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, ';
        features += `copyhistory=no, width=${mergedOptions.w}, height=${mergedOptions.h}, top=${top}, left=${left}`;
        return new PopupWindow(url, mergedOptions.title, features, mergedOptions.useOverlay);
    }

    private readonly useOverlay: boolean;
    private readonly id: string;
    private win?: Window | null;
    private interval?: number;

    constructor(url?: string,
                target?: string,
                features?: string,
                useOverlay?: boolean,
                replace?: boolean) {
        this.id = `id-${Utils.uuidv4()}`;
        this.useOverlay = typeof useOverlay !== 'undefined' ? useOverlay : true;
        this.win = window.open(url, target, features);
        if (this.win) {
            this.setCloseInterval();
        } else {
            throw new Error('Something went wrong while trying to open the popup');
        }
        this.openOverlay();
    }

    private setCloseInterval() {
        this.interval = window.setInterval(() => {
            if (!this.win || this.win.closed) {
                this.clearCloseInterval();
                this.close();
            }
        }, 100);
    }

    private clearCloseInterval() {
        window.clearInterval(this.interval);
    }

    public close() {
        if (this.win) {
            this.win.close();
            this.closeOverlay();
        }
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

    public postMessage(message: any,
                       targetOrigin: string,
                       transfer?: Transferable[]): void {
        if (this.win) {
            this.win.postMessage(message, targetOrigin, transfer);
        }
    }

    private closeOverlay(): void {
        if (this.useOverlay) {
            const overlay = document.querySelector(`#${this.id}`);
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }
    }

    private openOverlay(): void {
        if (this.useOverlay) {
            //remove existing overlay divs


            const overlayDiv: HTMLDivElement = document.createElement('div');
            overlayDiv.id = this.id;
            overlayDiv.classList.add(PopupWindow.CONST.overlayClassName);
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
                `<div style="margin-bottom: 1rem">${PopupWindow.CONST.overlayMessage}</div>` +
                `<div><a style="${PopupWindow.CONST.overlayLinkStyle}" href="javascript:void(0)" class="${PopupWindow.CONST.overlayLinkClassName}">${PopupWindow.CONST.overlayLinkMessage}</a></div>` +
                `<a style="${PopupWindow.CONST.overlayLinkStyle} position: absolute; right: 1rem; top: 1rem;" href="javascript:void(0)" class="${PopupWindow.CONST.overlayCloseLinkClassName}">X</a>` +
                `</div>`;
            let existingOverlays = document.getElementsByClassName(PopupWindow.CONST.overlayClassName);
            for (var i = 0; i < existingOverlays.length; i++) {
                let existingOverlay = existingOverlays.item(i);
                if (existingOverlay) {
                    existingOverlay.remove();
                }
            }
            document.body.appendChild(overlayDiv);
            const link = overlayDiv.querySelector(`#${this.id} .${PopupWindow.CONST.overlayLinkClassName}`);
            const closeLink = overlayDiv.querySelector(`#${this.id} .${PopupWindow.CONST.overlayCloseLinkClassName}`);
            if (link) {
                link.addEventListener('click', () => {
                    this.focus();
                });
            }
            if (closeLink) {
                closeLink.addEventListener('click', () => {
                    this.close();
                })
            }
        }
    }
}

export interface OpenWindowOptions {
    title?: string,
    w?: number,
    h?: number,
    useOverlay?: boolean,
}
