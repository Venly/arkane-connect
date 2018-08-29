import EthereumTransactionData from '@/api/EthereumTransactionData';
import {EVENT_TYPES} from '../types/EventTypes';
import {CHAIN_TYPES} from '../types/ChainTypes';
import ResponseBody from '@/api/ResponseBody';
import VechainTransactionData from '@/api/VechainTransactionData';

export default class ArkaneConnect {
    private static openWindow(url: string, title: string = 'Arkane Connect', w: number = 300, h: number = 500) {
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

    public async signEthereumTransaction(params: EthereumTransactionData) {
        return this.signTransaction(() => {
            this.sendEthParams(params)
        });
    }

    public async signVechainTransaction(params: VechainTransactionData) {
        return this.signTransaction(() => {
            this.sendVechainParams(params)
        });
    }

    private async signTransaction(sendParams: any) {
        if (!this.popup) {
            return new Promise((resolve, reject) => {
                const url = `${this.loc}/sign/transaction`;
                this.popup = ArkaneConnect.openWindow(url) as Window;
                const interval = sendParams();
                this.addEventListener(interval, resolve, reject);
            });
        }

        this.popup.focus();
        return {
            success: false,
            errors: ['Popup already open'],
        };
    }

    private sendEthParams(params: EthereumTransactionData) {
        return this.sendMessage({
            type: EVENT_TYPES.SEND_PARAMS,
            chain: CHAIN_TYPES.ETHEREUM,
            params,
        });
    }

    private sendVechainParams(params: VechainTransactionData) {
        return this.sendMessage({
            type: EVENT_TYPES.SEND_PARAMS,
            chain: CHAIN_TYPES.VECHAIN,
            params,
        });
    }

    private sendMessage(message: any) {
        const interval = setInterval(() => {
            if (!this.popup) {
                clearInterval(interval);
            } else {
                this.popup.postMessage(message, this.loc);
            }
        }, 3000);
        return interval;
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
                this.popup.close();
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

if(window) {
    (window as any).ArkaneConnect = ArkaneConnect;
}
