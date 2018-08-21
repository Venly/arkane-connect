import EthereumTransactionData from '@/api/EthereumTransactionData';
import {EVENT_TYPES} from '../types/EventTypes';
import ResponseBody from '@/api/ResponseBody';

export default class ArkaneConnect {
    public static async signTransaction(params: EthereumTransactionData) {
        const instance = ArkaneConnect.getInstance();

        (console as any).log(!instance.popup);
        if (!instance.popup) {
            return new Promise((resolve, reject) => {
                const url = `${instance.loc}/sign/transaction`;
                instance.popup = ArkaneConnect.openWindow(url) as Window;
                const interval = instance.sendParams(params);
                instance.addEventListener(interval, resolve, reject);
            });
        }

        instance.popup.focus();
        return {
            success: false,
            errors: ['Popup already open'],
        };
    }

    private static instance: ArkaneConnect;

    private static getInstance() {
        if (!this.instance) {
            this.instance = new ArkaneConnect('http://localhost:8081');
        }
        return this.instance;
    }

    private static serialize(obj: any) {
        const str = [];
        for (const p in obj) {
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            }
        }
        return str.join('&');
    }

    private static openWindow(url: string, title: string = 'Arkane Connect', w: number = 450, h: number = 650) {
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

    public popup!: Window;
    public loc: string = '';

    constructor(loc: string) {
        this.loc = loc;
    }

    public sendParams(params: EthereumTransactionData) {
        const interval = setInterval(() => {
            if (!this.popup) {
                clearInterval(interval);
            } else {
                this.popup.postMessage({
                    type: EVENT_TYPES.SEND_PARAMS,
                    params,
                }, this.loc);
            }
        }, 3000);
    }

    private addEventListener(interval: any, resolve: any, reject: any) {
        window.addEventListener('message', (e) => {
            if (e.origin === this.loc) {
                const data = this.messageHandler(e);
                if (data) {
                    clearInterval(interval);
                    if (data && data.success) {
                        resolve(data);
                    } else {
                        reject(data);
                    }
                }
            }
        }, false);
    }

    private messageHandler(event: MessageEvent): ResponseBody | false {
        const data = event.data && {...event.data.data};
        switch (event.data && event.data.type) {
            case EVENT_TYPES.TRANSACTION_SIGNED:
                //this.popup.close();
                return data;
            case EVENT_TYPES.POPUP_CLOSED:
                delete this.popup;
                return {
                    success: false,
                    errors: ['Popup closed'],
                    result: {},
                };
            default:
                return false;
        }
    }
}

if (window) {
    (window as any).ArkaneConnect = ArkaneConnect;
}
