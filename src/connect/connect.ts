import { KeycloakInstance } from 'keycloak-js';

import { LoginResult, Security }             from './Security';
import { Api }                               from '../api/Api';
import { WindowMode }                        from '../models/WindowMode';
import { PopupResult }                       from '../popup/PopupResult';
import { PopupSigner }                       from '../signer/PopupSigner';
import { Signer, SignerFactory, SignMethod } from '../signer/Signer';
import Utils                                 from '../utils/Utils';
import { Flows }                             from './Flows';

export class ArkaneConnect {

    public api!: Api;
    public signUsing: WindowMode;
    public flows: Flows;
    public windowMode: WindowMode;
    public _bearerTokenProvider: () => string;

    private clientId: string;
    private auth?: KeycloakInstance;

    constructor(clientId: string, options?: ConstructorOptions) {
        this.clientId = clientId;
        this.signUsing = (options && options.signUsing as unknown as WindowMode) || WindowMode.POPUP;
        this.windowMode = (options && options.windowMode) || WindowMode.POPUP;
        Utils.rawEnvironment = options && options.environment || 'prod';
        this._bearerTokenProvider = options && options.bearerTokenProvider || (() => this.auth && this.auth.token || '');
        if (this._bearerTokenProvider) {
            this.api = new Api(Utils.urls.api, this._bearerTokenProvider);
        }

        this.flows = new Flows(this, this.clientId);
    }

    public async checkAuthenticated(): Promise<AuthenticationResult> {
        const loginResult = await Security.checkAuthenticated(this.clientId);
        return this.afterAuthentication(loginResult);
    }

    public logout(options?: AuthenticationOptions): Promise<void> {
        const windowMode = options && options.windowMode || this.windowMode;
        if (windowMode === WindowMode.REDIRECT) {
            return new Promise<void>((resolve: any, reject: any) => {
                const logoutOptions = {};
                if (options && options.redirectUri) {
                    Object.assign(logoutOptions, {redirectUri: options.redirectUri});
                }
                this.auth ? this.auth.logout(logoutOptions).success(() => resolve()).error(() => reject) : resolve();
            })
        } else {
            return this.auth ? Security.logout(this.auth) : Promise.resolve();
        }
    }

    public addOnTokenRefreshCallback(tokenRefreshCallback?: (token: string) => void): void {
        if (tokenRefreshCallback) {
            Security.onTokenUpdate = tokenRefreshCallback;
        }
    }

    public createSigner(windowMode?: WindowMode): Signer {
        return SignerFactory.createSignerFor(windowMode || this.signUsing || this.windowMode, this._bearerTokenProvider);
    }

    public isPopupSigner(signer: Signer): signer is PopupSigner {
        return (<PopupSigner>signer).closePopup !== undefined;
    }

    /* Deprecated - Use flows.authenticate instead */
    public async authenticate(options?: AuthenticationOptions): Promise<AuthenticationResult> {
        return this.flows.authenticate(options);
    }

    /* Deprecated - Use flows.manageWallets instead */
    public manageWallets(chain: string, options?: { redirectUri?: string, correlationID?: string, windowMode?: WindowMode }): Promise<PopupResult | void> {
        return this.flows.manageWallets(chain, options);
    }

    /* Deprecated - Use flows.linkWallets instead */
    public linkWallets(options?: { redirectUri?: string, correlationID?: string, windowMode?: WindowMode }): Promise<PopupResult | void> {
        return this.flows.linkWallets(options);
    }

    public _afterAuthenticationForFlowUse(loginResult: LoginResult): AuthenticationResult {
        return this.afterAuthentication(loginResult);
    }

    private afterAuthentication(loginResult: LoginResult): AuthenticationResult {
        // this.auth is needed for the bearerTokenProvider
        this.auth = loginResult.keycloak;
        return {
            auth: this.auth,
            isAuthenticated: loginResult.authenticated,
            authenticated(this: AuthenticationResult, callback: (auth: KeycloakInstance) => void) {
                if (loginResult.authenticated && loginResult.keycloak) {
                    callback(loginResult.keycloak);
                }
                return this;
            },
            notAuthenticated(this: AuthenticationResult, callback: (auth?: KeycloakInstance) => void) {
                if (!loginResult.authenticated) {
                    callback(loginResult.keycloak);
                }
                return this;
            },
        };
    }
}

export interface AuthenticationResult {
    auth?: KeycloakInstance,
    isAuthenticated: boolean,
    authenticated: (onAuthenticated: (auth: KeycloakInstance) => void) => AuthenticationResult;
    notAuthenticated: (onNotAuthenticated: (auth?: KeycloakInstance) => void) => AuthenticationResult;
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
