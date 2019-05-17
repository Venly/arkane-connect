import { KeycloakInstance, KeycloakPromise } from 'keycloak-js';

import { LoginResult, Security }             from './Security';
import { Api }                               from '../api/Api';
import { SecretType }                        from '../models/SecretType';
import { Wallet }                            from '../models/wallet/Wallet';
import { WindowMode }                        from '../models/WindowMode';
import { GeneralPopup }                      from '../popup/GeneralPopup';
import { PopupActions }                      from '../popup/PopupActions';
import { PopupResult }                       from '../popup/PopupResult';
import { PopupSigner }                       from '../signer/PopupSigner';
import { Signer, SignerFactory, SignMethod } from '../signer/Signer';
import Utils                                 from '../utils/Utils';

export class ArkaneConnect {

    public api!: Api;
    public signUsing: WindowMode;
    public windowMode: WindowMode;

    private clientId: string;
    private bearerTokenProvider: () => string;
    private auth!: KeycloakInstance;

    constructor(clientId: string, options?: ConstructorOptions) {
        this.clientId = clientId;
        this.signUsing = (options && options.signUsing as unknown as WindowMode) || WindowMode.POPUP;
        this.windowMode = (options && options.windowMode) || WindowMode.POPUP;
        Utils.rawEnvironment = options && options.environment || 'prod';
        this.bearerTokenProvider = options && options.bearerTokenProvider || (() => this.auth.token && this.auth.token || '');
        if (this.bearerTokenProvider) {
            this.api = new Api(Utils.urls.api, this.bearerTokenProvider);
        }
    }

    public async getUserAndWalletsFlow(chain: SecretType): Promise<UserAndWalletsResult> {
        let loginResult = await Security.checkAuthenticated(this.clientId);
        let wallets: Wallet[] = [];

        try {
            // Check if authenticated
            if (!loginResult.authenticated) {
                loginResult = await Security.login(this.clientId, {windowMode: WindowMode.POPUP, closePopup: false});
            }

            if (loginResult.authenticated) {
                this.auth = loginResult.keycloak;
                wallets = await this.api.getWallets({secretType: chain.toUpperCase() as SecretType});
                if (!(wallets && wallets.length > 0)) {
                    const popupResult = await this.manageWallets(chain,{windowMode: WindowMode.POPUP});
                    if (popupResult && popupResult.status === 'SUCCESS') {
                        wallets = await this.api.getWallets({secretType: chain.toUpperCase() as SecretType});
                    }
                }
            } else {
                throw Error('Something went wrong.');
            }

            if (wallets.length === 0) {
                throw Error('Something went wrong.');
            }
        } catch (e) {
            console.error(e);
        } finally {
            if (loginResult && loginResult.popupWindow) {
                loginResult.popupWindow.close();
            }
        }

        return {
            wallets: wallets,
            auth: loginResult.keycloak,
            isAuthenticated: loginResult.authenticated
        }
    }

    public async checkAuthenticated(): Promise<AuthenticationResult> {
        const loginResult = await Security.checkAuthenticated(this.clientId);
        return this.afterAuthentication(loginResult);
    }

    public async authenticate(options?: AuthenticationOptions): Promise<AuthenticationResult> {
        let authOptions: AuthenticationOptions = {...options};
        authOptions.windowMode = authOptions.windowMode || this.windowMode;
        const loginResult = await Security.login(this.clientId, authOptions);
        return this.afterAuthentication(loginResult);
    }

    public logout(): KeycloakPromise<void, void> {
        return this.auth.logout();
    }

    public addOnTokenRefreshCallback(tokenRefreshCallback?: (token: string) => void): void {
        if (tokenRefreshCallback) {
            Security.onTokenUpdate = tokenRefreshCallback;
        }
    }

    public manageWallets(chain: string, options?: { redirectUri?: string, correlationID?: string, windowMode?: WindowMode }): Promise<PopupResult | void> {
        const windowMode = options && options.windowMode || this.windowMode;
        if (windowMode === WindowMode.REDIRECT) {
            return this.manageWalletsRedirect(chain, options);
        } else {
            return this.manageWalletsPopup(chain);
        }
    }

    private manageWalletsRedirect(chain: string, options?: { redirectUri?: string, correlationID?: string }): Promise<void> {
        Utils.http().postInForm(
            `${Utils.urls.connect}/wallets/manage`,
            {chain: chain.toLowerCase()},
            this.bearerTokenProvider,
            options
        );
        return Promise.resolve();
    }

    private manageWalletsPopup(chain: string): Promise<PopupResult> {
        return GeneralPopup.openNewPopup(PopupActions.MANAGE_WALLETS, this.bearerTokenProvider, {chain: chain.toLowerCase()});
    }

    public linkWallets(options?: { redirectUri?: string, correlationID?: string, windowMode?: WindowMode }): Promise<PopupResult | void> {
        const windowMode = options && options.windowMode || this.windowMode;
        if (windowMode === WindowMode.REDIRECT) {
            return this.linkWalletsRedirect(options);
        } else {
            return this.linkWalletsPopup();
        }
    }

    private linkWalletsRedirect(options?: { redirectUri?: string, correlationID?: string }): Promise<void> {
        Utils.http().postInForm(
            `${Utils.urls.connect}/wallets/link`,
            {},
            this.bearerTokenProvider,
            options
        );
        return Promise.resolve();
    }

    private linkWalletsPopup(): Promise<PopupResult> {
        return GeneralPopup.openNewPopup(PopupActions.LINK_WALLET, this.bearerTokenProvider);
    }

    public createSigner(windowMode?: WindowMode): Signer {
        return SignerFactory.createSignerFor(windowMode || this.signUsing || this.windowMode, this.bearerTokenProvider);
    }

    public isPopupSigner(signer: Signer): signer is PopupSigner {
        return (<PopupSigner>signer).closePopup !== undefined;
    }

    private afterAuthentication(loginResult: LoginResult): AuthenticationResult {
        // this.auth is needed for the bearerTokenProvider
        this.auth = loginResult.keycloak;
        return {
            auth: this.auth,
            isAuthenticated: loginResult.authenticated,
            authenticated(this: AuthenticationResult, callback: (auth: KeycloakInstance) => void) {
                if (loginResult.authenticated) {
                    callback(loginResult.keycloak);
                }
                return this;
            },
            notAuthenticated(this: AuthenticationResult, callback: (auth: KeycloakInstance) => void) {
                if (!loginResult.authenticated) {
                    callback(loginResult.keycloak);
                }
                return this;
            },
        };
    }
}

export interface UserAndWalletsResult {
    wallets: Wallet[],
    auth: KeycloakInstance,
    isAuthenticated: boolean
}

export interface AuthenticationResult {
    auth: KeycloakInstance,
    isAuthenticated: boolean,
    authenticated: (onAuthenticated: (auth: KeycloakInstance) => void) => AuthenticationResult;
    notAuthenticated: (onNotAuthenticated: (auth: KeycloakInstance) => void) => AuthenticationResult;
}

export interface ConstructorOptions {
    chains?: string[];
    environment?: string;
    windowMode?: WindowMode;
    signUsing?: SignMethod; // Deprecated, use WindowMode
    bearerTokenProvider?: () => string;
}

export interface AuthenticationOptions {
    redirectUri?: string;
    windowMode?: WindowMode;
    closePopup?: boolean
}
