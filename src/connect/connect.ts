/* tslint:disable */
/// <reference path="./typings.d.ts" />
/* tslint:enable */
import {AxiosResponse} from 'axios';
import {EVENT_TYPES} from '../types/EventTypes';
import ResponseBody from '../api/ResponseBody';
import RestApi from '../api/RestApi';
import {Wallet} from '../models/Wallet';
import Utils from '../utils/Utils';
import {Profile} from '../models/Profile';

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
    public bearer: string = '';
    // public auth!: any;

    public api!: RestApi;
    public clientId: string;

    constructor(clientId: string = 'Arkane', bearerToken: string, environment?: string) {
        this.clientId = clientId;
        Utils.environment = environment || 'prod';
        this.api = new RestApi(Utils.urls.api);
        this.updateBearerToken(bearerToken);
    }

    public async init(chain: string): Promise<void> {
        const wallets = await this.getWallets();
        if (!(wallets && wallets.length > 0)) {
            const currentLocation = window.location;
            const redirectUri = encodeURIComponent(currentLocation.origin + currentLocation.pathname + currentLocation.search);
            window.location.href =
                `${Utils.urls.connect}/init/${chain}/${this.bearer}?redirectUri=${redirectUri}` +
                `${Utils.environment ? '&environment=' + Utils.environment : ''}`;
        }
        return;
    }

    public updateBearerToken(bearer: string) {
        this.bearer = bearer;
        this.api.http.defaults.headers.common = {
            Authorization: this.bearer ? `Bearer ${this.bearer}` : '',
        };
    }

    public async getWallets(): Promise<Wallet[]> {
        const response: AxiosResponse = await this.api.http.get('wallets');
        if (response && response.data && response.data.success) {
            return response.data.result;
        } else {
            return [];
        }
    }

    public async getProfile(): Promise<Profile> {
        const response: AxiosResponse = await this.api.http.get('profile');
        if (response && response.data && response.data.success) {
            return response.data.result;
        } else {
            return new Profile();
        }
    }

    public async signTransaction(params: any) {
        return this.signTransactionInPopup(() => {
            this.sendParams(params);
        });
    }

    public async initPopup() {
        const url =
            `${Utils.urls.connect}/sign/transaction/init`;
        this.popup = ArkaneConnect.openWindow(url) as Window;
        return {
            success: false,
            errors: ['Popup already open'],
        };
    }

    private async signTransactionInPopup(sendParams: any) {
        if (!this.popup || this.popup.closed) {
            await this.initPopup();
        }
        this.popup.focus();
        return new Promise((resolve, reject) => {
            const url = `${Utils.urls.connect}/sign/transaction/${this.bearer}${Utils.environment ? '?environment=' + Utils.environment : ''}`;
            this.popup = ArkaneConnect.openWindow(url) as Window;
            const interval = sendParams();
            this.addEventListener(interval, resolve, reject);
        });
    }

    private sendParams(params: any) {
        return this.sendMessage({
            type: EVENT_TYPES.SEND_PARAMS,
            params,
        });
    }

    private sendMessage(message: any) {
        const interval = setInterval(() => {
            if (!this.popup) {
                clearInterval(interval);
            } else {
                this.popup.postMessage(message, Utils.urls.connect);
            }
        }, 3000);
        return interval;
    }

    private addEventListener(interval: any, resolve: any, reject: any) {
        window.addEventListener('message', (event) => {
            if (event.origin === Utils.urls.connect) {
                const data = this.messageHandler(event);
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

if (window) {
    (window as any).ArkaneConnect = ArkaneConnect;
}
