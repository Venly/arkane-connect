/* tslint:disable */
/// <reference path="./typings.d.ts" />
/* tslint:enable */
import {AxiosResponse} from 'axios';
import {EVENT_TYPES} from '../../types/EventTypes';
import RestApi from '../../api/RestApi';
import {Wallet} from '../../models/Wallet';
import Utils from '../../utils/Utils';
import {Profile} from '../../models/Profile';
import Security, {LoginResult} from '../../Security';
import {KeycloakInstance, KeycloakPromise} from 'keycloak-js';

export class ArkaneConnect {

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
    private popup?: Window;
    private messagePort?: MessagePort;
    private api!: RestApi;
    private clientId: string;
    private chains: string[];
    private bearerTokenProvider: any;

    private auth!: KeycloakInstance;

    constructor(clientId: string, chains?: string[], environment?: string) {
        this.clientId = clientId;
        this.chains = (chains || []).map((chain: string) => chain.toLowerCase());
        Utils.environment = environment || 'prod';
        this.addBeforeUnloadListener();
    }

    public checkAuthenticated(): Promise<AuthenticationResult> {
        return Security.checkAuthenticated(this.clientId)
                       .then((loginResult: LoginResult) => this.afterAuthentication(loginResult));
    }

    public authenticate(): Promise<AuthenticationResult> {
        return Security.login(this.clientId)
                       .then((loginResult: LoginResult) => this.afterAuthentication(loginResult));
    }

    public async afterAuthentication(loginResult: LoginResult): Promise<AuthenticationResult> {
        this.auth = loginResult.keycloak;
        return this.init()
                   .then(() => {
                       return {
                           authenticated(this: AuthenticationResult, callback: (auth: KeycloakInstance) => void) {
                               callback(loginResult.keycloak);
                               return this;
                           },
                           notAuthenticated(this: AuthenticationResult, callback: (auth: KeycloakInstance) => void) {
                               callback(loginResult.keycloak);
                               return this;
                           },
                       };
                   });
    }

    public logout(): KeycloakPromise<void, void> {
        return this.auth.logout();
    }

    public addOnTokenRefreshCallback(tokenRefreshCallback?: (token: string) => void): void {
        if (tokenRefreshCallback) {
            Security.onTokenUpdate = tokenRefreshCallback;
        }
    }

    public async init(bearerTokenProvider?: any): Promise<void> {
        if (bearerTokenProvider) {
            this.bearerTokenProvider = bearerTokenProvider;
        } else {
            this.bearerTokenProvider = () => this.auth.token;
        }

        if (this.bearerTokenProvider) {
            this.api = new RestApi(Utils.urls.api, this.bearerTokenProvider);
            const wallets = await this.getWallets();
            const mandatoryWallets = wallets && wallets.length > 0 && this.filterOnMandatoryWallets(wallets);
            if (!(mandatoryWallets && mandatoryWallets.length > 0)) {
                const currentLocation = window.location;
                const redirectUri = encodeURIComponent(currentLocation.origin + currentLocation.pathname + currentLocation.search);
                window.location.href =
                    `${Utils.urls.connect}/init/${this.chains[0]}/${this.bearerTokenProvider()}?redirectUri=${redirectUri}` +
                    `${Utils.environment ? '&environment=' + Utils.environment : ''}`;
            }
        }
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
            const url = `${Utils.urls.connect}/sign/transaction/${params.type}/${this.bearerTokenProvider()}${Utils.environment ? '?environment=' + Utils.environment : ''}`;
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

    private filterOnMandatoryWallets(wallets: Wallet[]) {
        return wallets.filter(
            (wallet: Wallet) => this.chains.find(
                (chain: string) => (wallet.secretType as string).toLowerCase() === chain,
            ) !== undefined,
        );
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

export interface AuthenticationResult {
    authenticated: (onAuthenticated: (auth: KeycloakInstance) => void) => AuthenticationResult;
    notAuthenticated: (onNotAuthenticated: (auth: KeycloakInstance) => void) => AuthenticationResult;
}

if (typeof window !== 'undefined') {
    (window as any).ArkaneConnect = ArkaneConnect;
}
