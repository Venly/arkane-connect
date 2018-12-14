/* tslint:disable */
/// <reference path="./typings.d.ts" />
/* tslint:enable */
import { Wallet }                            from '../../models/wallet/Wallet';
import Utils                                 from '../../utils/Utils';
import { LoginResult, Security }             from './Security';
import { KeycloakInstance, KeycloakPromise } from 'keycloak-js';
import { Api }                               from '../../api';
import { Signer, SignerFactory, SignMethod } from '../../signer';
import { PopupSigner }                       from '../../signer/PopupSigner';

export class ArkaneConnect {

    public api!: Api;

    private clientId: string;
    private chains: string[];
    private signUsing: SignMethod;
    private bearerTokenProvider: () => string;
    private auth!: KeycloakInstance;

    constructor(clientId: string, options?: ConstructorOptions) {
        this.clientId = clientId;
        this.chains = (options && options.chains || []).map((chain: string) => chain.toLowerCase());
        this.signUsing = (options && options.signUsing) || SignMethod.POPUP;
        Utils.environment = options && options.environment || 'prod';
        this.bearerTokenProvider = options && options.bearerTokenProvider || (() => this.auth.token && this.auth.token || '');
        if (this.bearerTokenProvider) {
            this.api = new Api(Utils.urls.api, this.bearerTokenProvider);
        }
    }

    public checkAuthenticated(options?: AuthenticationOptions): Promise<AuthenticationResult> {
        return Security.checkAuthenticated(this.clientId, options && options.redirectUri)
                       .then((loginResult: LoginResult) => this.afterAuthentication(loginResult));
    }

    public authenticate(options?: AuthenticationOptions): Promise<AuthenticationResult> {
        return Security.login(this.clientId, options && options.redirectUri)
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

    public manageWallets(options?: { redirectUri?: string, correlationID?: string }) {
        Utils.http().postInForm(
            `${Utils.urls.connect}/wallets/manage${Utils.environment ? '?environment=' + Utils.environment : ''}`,
            {chain: this.chains[0]},
            this.bearerTokenProvider,
            options
        );
    }

    public linkWallets(options?: { redirectUri?: string, correlationID?: string }) {
        Utils.http().postInForm(`${Utils.urls.connect}/wallets/link${Utils.environment ? '?environment=' + Utils.environment : ''}`, {}, this.bearerTokenProvider, options);
    }

    public createSigner(signUsing?: SignMethod): Signer {
        return SignerFactory.createSignerFor(signUsing || this.signUsing, this.bearerTokenProvider);
    }

    public isPopupSigner(signer: Signer): signer is PopupSigner {
        return (<PopupSigner>signer).closePopup !== undefined;
    }

    private filterOnMandatoryWallets(wallets: Wallet[]): Wallet[] {
        return wallets.filter(
            (wallet: Wallet) => this.chains.find(
                (chain: string) => (wallet.secretType as string).toLowerCase() === chain,
            ) !== undefined,
        );
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
    signUsing?: SignMethod;
    bearerTokenProvider?: () => string;
}

export interface AuthenticationOptions {
    redirectUri?: string;
}
