/* tslint:disable */
/// <reference path="./typings.d.ts" />
/* tslint:enable */
import {AxiosResponse} from 'axios';
import {EVENT_TYPES} from '../../types/EventTypes';
import ResponseBody from '../../api/ResponseBody';
import RestApi from '../../api/RestApi';
import {Wallet} from '../../models/Wallet';
import Utils from '../../utils/Utils';
import {Profile} from '../../models/Profile';

export class ArkaneConnect {

    private static openWindow(url: string, title: string = 'Arkane Connect', w: number = 300, h: number = 530) {
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

    private popup?: Window;
    private messagePort?: MessagePort;

    private api!: RestApi;
    private clientId: string;
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
        if (this.popup) {
            this.popup.focus();
        }
        return new Promise((resolve, reject) => {
            const url = `${Utils.urls.connect}/sign/transaction/${this.bearerTokenProvider()}${Utils.environment ? '?environment=' + Utils.environment : ''}`;
            this.popup = ArkaneConnect.openWindow(url) as Window;
            window.addEventListener('message', (message: MessageEvent) => {
                if (Utils.messages().hasValidOrigin(message) && Utils.messages().isOfType(message, EVENT_TYPES.SIGNER_MOUNTED)) {
                    this.initMessageChannel(params, message, resolve, reject);
                }
            });
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
        if (this.messagePort) {
            this.messagePort.close();
            delete this.messagePort;
        }
    }


    private initMessageChannel(params: any, message: MessageEvent, resolve: any, reject: any) {
        this.messagePort = message.ports[0];
        this.messagePort.onmessage = this.createMessageHandler(resolve, reject);
        this.messagePort.postMessage({type: EVENT_TYPES.SEND_TRANSACTION_DATA, params});
    }

    private createMessageHandler(resolve: any, reject: any) {
        return (message: MessageEvent) => {
            if (Utils.messages().hasType(message)) {
                switch (message.data.type) {
                    case EVENT_TYPES.TRANSACTION_SIGNED:
                        this.closePopup();
                        resolve(message.data && {...message.data.data});
                        break;
                    case EVENT_TYPES.POPUP_CLOSED:
                        delete this.popup;
                        reject({
                            success: false,
                            errors: ['Popup closed'],
                            result: {},
                        });
                        break;
                }
            }
        };
    }

    private addBeforeUnloadListener() {
        window.addEventListener('beforeunload', () => {
            this.closePopup();
        });
    }
}

if (typeof window !== 'undefined') {
    (window as any).ArkaneConnect = ArkaneConnect;
}
