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

    private static openWindow(url: string, title: string = 'Arkane Connect', w: number = 350, h: number = 870) {
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

    public api!: RestApi;
    public clientId: string;
    private bearerTokenProvider: any;

    constructor(clientId: string = 'Arkane', bearerTokenProvider: any, environment?: string) {
        this.clientId = clientId;
        Utils.environment = environment || 'prod';
        this.api = new RestApi(Utils.urls.api, bearerTokenProvider);
        this.bearerTokenProvider = bearerTokenProvider;
        this.addBeforeUnloadListener();
    }

    public async init(chain: string): Promise<void> {
        const wallets = await this.getWallets();
        if (!(wallets && wallets.length > 0)) {
            const currentLocation = window.location;
            const redirectUri = encodeURIComponent(currentLocation.origin + currentLocation.pathname + currentLocation.search);
            window.location.href =
                `${Utils.urls.connect}/init/${chain}/${this.bearerTokenProvider()}?redirectUri=${redirectUri}` +
                `${Utils.environment ? '&environment=' + Utils.environment : ''}`;
        }
        return;
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
        if (!this.popup || this.popup.closed) {
            await this.initPopup();
        }
        this.popup.focus();
        return new Promise((resolve, reject) => {
            const url = `${Utils.urls.connect}/sign/transaction/${params.type}/${this.bearerTokenProvider()}${Utils.environment ? '?environment=' + Utils.environment : ''}`;
            this.popup = ArkaneConnect.openWindow(url) as Window;
            this.postTransactionData(params);
            this.addEventListeners(params, resolve, reject);
        });
    }

    public async initPopup() {
        const url = `${Utils.urls.connect}/sign/transaction/init`;
        this.popup = ArkaneConnect.openWindow(url) as Window;
        return {
            success: false,
            errors: ['Popup already open'],
        };
    }

    public closePopup() {
        if (this.popup) {
            this.popup.close();
            delete this.popup;
        }
    }

    private addEventListeners(params: any, resolve: any, reject: any) {
        window.addEventListener('message', (event) => {
                if (event.origin === Utils.urls.connect) {
                    if (event.data && event.data.type) {
                        if (event.data.type === EVENT_TYPES.SIGNER_MOUNTED) {
                            this.popup = (event.source as Window);
                            this.postTransactionData(params);
                        } else {
                            const data = this.messageHandler(event);
                            if (data) {
                                if (data && data.success) {
                                    resolve(data);
                                } else {
                                    reject(data);
                                }
                            }
                        }
                    }
                }
            },
            false);
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

    private postTransactionData(params: any) {
        this.popup.postMessage({type: EVENT_TYPES.SEND_TRANSACTION_DATA, params}, Utils.urls.connect);
    }

    private addBeforeUnloadListener() {
        window.addEventListener('beforeunload', () => {
            if (this.popup) {
                this.popup.close();
            }
        });
    }
}

if (window) {
    (window as any).ArkaneConnect = ArkaneConnect;
}
