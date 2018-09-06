/* tslint:disable */
/// <reference path="./typings.d.ts" />
/* tslint:enable */
import {AxiosResponse} from 'axios';
import EthereumTransactionData from '../api/EthereumTransactionData';
import VechainTransactionData from '../api/VechainTransactionData';
import {EVENT_TYPES} from '../types/EventTypes';
import {CHAIN_TYPES} from '../types/ChainTypes';
import ResponseBody from '../api/ResponseBody';
import RestApi from '../api/RestApi';
import Security from '../Security';
import {Wallet} from '../models/Wallet';
import {KeycloakPromise} from 'keycloak-js';
import Utils from '../utils/Utils';

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
    public auth!: any;

    public api!: RestApi;
    public clientId: string;
    public chain: string;

    constructor(clientId: string = 'Arkane', chain: string, environment?: string) {
        this.clientId = clientId;
        this.chain = chain.toLowerCase();
        Utils.environment = environment || 'prod';
    }

    public login(params: any): KeycloakPromise<void, void> {
        return this.auth.login(params);
    }

    public logout(): KeycloakPromise<void, void> {
        return this.auth.logout();
    }

    public async init(): Promise<void> {
        const {keycloak} = await Security.login(this.clientId);
        this.auth = keycloak;
        this.api = new RestApi(Utils.urls.api);
        this.updateBearerToken(this.auth.token);

        if (this.auth.authenticated) {
            const wallets = await this.getWallets();
            if (!(wallets && wallets.length > 0)) {
                window.location.href =
                    `${Utils.urls.connect}/init/${this.clientId}/${this.chain}/${this.bearer}/${Utils.environment}`;
            }
        }

        return this.auth;
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

    public async signTransaction(params: EthereumTransactionData | VechainTransactionData) {

        switch (this.chain) {
            case 'vechain':
                return this.signTransactionInPopup(() => {
                    this.sendVechainParams((params as VechainTransactionData));
                });
            case 'ethereum':
                return this.signTransactionInPopup(() => {
                    this.sendEthParams((params as EthereumTransactionData));
                });
        }
    }

    private async signTransactionInPopup(sendParams: any) {
        if (!this.popup || this.popup.closed) {
            return new Promise((resolve, reject) => {
                const url =
                    `${Utils.urls.connect}/sign/transaction/${this.clientId}/` +
                    `${this.chain}/${this.bearer}/${Utils.environment}`;
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
                this.popup.postMessage(message, Utils.urls.connect);
            }
        }, 3000);
        return interval;
    }

    private addEventListener(interval: any, resolve: any, reject: any) {
        window.addEventListener('message', (e) => {
            if (e.origin === Utils.urls.connect) {
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

if (window) {
    (window as any).ArkaneConnect = ArkaneConnect;
}
