import { KeycloakInstance, KeycloakPromise } from 'keycloak-js';
import { Api }                               from '../api/Api';
import { WindowMode }                        from '../models/WindowMode';
import { GeneralPopup }                      from '../popup/GeneralPopup';
import { PopupActions }                      from '../popup/PopupActions';
import { PopupResult }                       from '../popup/PopupResult';
import { LoginResult, Security }             from './Security';
import { PopupSigner }                       from '../signer/PopupSigner';
import { Signer, SignerFactory, SignMethod } from '../signer/Signer';
import Utils                                 from '../utils/Utils';

export class ArkaneConnect {

    public api!: Api;
    public signUsing: SignMethod;
    public windowMode: WindowMode;

    private clientId: string;
    private bearerTokenProvider: () => string;
    private auth!: KeycloakInstance;

    constructor(clientId: string, options?: ConstructorOptions) {
        this.clientId = clientId;
        this.signUsing = (options && options.signUsing) || SignMethod.POPUP;
        this.windowMode = (options && options.windowMode) || WindowMode.POPUP;
        Utils.environment = options && options.environment || 'prod';
        this.bearerTokenProvider = options && options.bearerTokenProvider || (() => this.auth.token && this.auth.token || '');
        if (this.bearerTokenProvider) {
            this.api = new Api(Utils.urls.api, this.bearerTokenProvider);
        }
    }

    public checkAuthenticated(): Promise<AuthenticationResult> {
        return Security.checkAuthenticated(this.clientId)
                       .then((loginResult: LoginResult) => this.afterAuthentication(loginResult));
    }

    public authenticate(options?: AuthenticationOptions): Promise<AuthenticationResult> {
        return Security.login(this.clientId, options)
                       .then((loginResult: LoginResult) => this.afterAuthentication(loginResult));
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

    public createSigner(signUsing?: SignMethod): Signer {
        return SignerFactory.createSignerFor(signUsing || this.signUsing, this.bearerTokenProvider);
    }

    public isPopupSigner(signer: Signer): signer is PopupSigner {
        return (<PopupSigner>signer).closePopup !== undefined;
    }

    private async afterAuthentication(loginResult: LoginResult): Promise<AuthenticationResult> {
        this.auth = loginResult.keycloak;
        return {
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

export interface AuthenticationResult {
    authenticated: (onAuthenticated: (auth: KeycloakInstance) => void) => AuthenticationResult;
    notAuthenticated: (onNotAuthenticated: (auth: KeycloakInstance) => void) => AuthenticationResult;
}

export interface ConstructorOptions {
    chains?: string[];
    environment?: string;
    windowMode?: WindowMode;
    /* Deprecated, use WindowMode */
    signUsing?: SignMethod;
    bearerTokenProvider?: () => string;
}

export interface AuthenticationOptions {
    redirectUri?: string;
}
