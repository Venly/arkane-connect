import { KeycloakInstance } from 'keycloak-js';

import { Security }                             from './Security';
import { SecretType }                           from '../models/SecretType';
import { Wallet }                               from '../models/wallet/Wallet';
import { WindowMode }                           from '../models/WindowMode';
import { GeneralPopup }                         from '../popup/GeneralPopup';
import { PopupActions }                         from '../popup/PopupActions';
import { PopupResult }                          from '../popup/PopupResult';
import Utils                                    from '../utils/Utils';
import { ArkaneConnect, AuthenticationOptions } from './connect';

export class Flows {
    private clientId: string;
    private arkaneConnect: ArkaneConnect;

    constructor(arkaneConnect: ArkaneConnect, clientId: string) {
        this.clientId = clientId;
        this.arkaneConnect = arkaneConnect;
    }

    public async authenticate(options?: AuthenticationOptions): Promise<AuthenticationResult> {
        let authOptions: AuthenticationOptions = {...options};
        authOptions.windowMode = authOptions.windowMode || this.arkaneConnect.windowMode;
        const loginResult = await Security.login(this.clientId, authOptions);
        return this.arkaneConnect._afterAuthenticationForFlowUse(loginResult);
    }

    public manageWallets(chain: string, options?: { redirectUri?: string, correlationID?: string, windowMode?: WindowMode }): Promise<PopupResult | void> {
        const windowMode = options && options.windowMode || this.arkaneConnect.windowMode;
        if (windowMode === WindowMode.REDIRECT) {
            return this.manageWalletsRedirect(chain, options);
        } else {
            return this.manageWalletsPopup(chain);
        }
    }

    public linkWallets(options?: { redirectUri?: string, correlationID?: string, windowMode?: WindowMode }): Promise<PopupResult | void> {
        const windowMode = options && options.windowMode || this.arkaneConnect.windowMode;
        if (windowMode === WindowMode.REDIRECT) {
            return this.linkWalletsRedirect(options);
        } else {
            return this.linkWalletsPopup();
        }
    }

    public async getAccount(chain: SecretType): Promise<Account> {
        let loginResult: any = {};
        let wallets: Wallet[] = [];
        let start = +Date.now();

        try {
            loginResult = await Security.login(this.clientId, {windowMode: WindowMode.POPUP, closePopup: false});

            let result = this.arkaneConnect._afterAuthenticationForFlowUse(loginResult);

            if (result.isAuthenticated) {
                wallets = await this.arkaneConnect.api.getWallets({secretType: chain.toUpperCase() as SecretType});
                if (!(wallets && wallets.length > 0)) {
                    const popupResult = await this.manageWallets(chain, {windowMode: WindowMode.POPUP});
                    if (popupResult && popupResult.status === 'SUCCESS') {
                        wallets = await this.arkaneConnect.api.getWallets({secretType: chain.toUpperCase() as SecretType});
                    }
                }
            }
            if (!result.isAuthenticated || wallets.length === 0) {
                throw Error('Something went wrong.');
            }
        } catch (e) {
            console.error(e);
        }

        if (loginResult && loginResult.popupWindow) {
            let timeout = 1500 - (+Date.now() - start);
            if (timeout <= 0) {
                loginResult.popupWindow.close();
            } else {
                setTimeout(() => {
                    loginResult.popupWindow.close();
                }, timeout);
            }
        }

        return {
            wallets: wallets,
            auth: loginResult.keycloak,
            isAuthenticated: loginResult.authenticated
        }
    }

    private manageWalletsRedirect(chain: string, options?: { redirectUri?: string, correlationID?: string }): Promise<void> {
        Utils.http().postInForm(
            `${Utils.urls.connect}/wallets/manage`,
            {chain: chain.toLowerCase()},
            this.arkaneConnect._bearerTokenProvider,
            options
        );
        return Promise.resolve();
    }

    private manageWalletsPopup(chain: string): Promise<PopupResult> {
        return GeneralPopup.openNewPopup(PopupActions.MANAGE_WALLETS, this.arkaneConnect._bearerTokenProvider, {chain: chain.toLowerCase()});
    }

    private linkWalletsRedirect(options?: { redirectUri?: string, correlationID?: string }): Promise<void> {
        Utils.http().postInForm(
            `${Utils.urls.connect}/wallets/link`,
            {},
            this.arkaneConnect._bearerTokenProvider,
            options
        );
        return Promise.resolve();
    }

    private linkWalletsPopup(): Promise<PopupResult> {
        return GeneralPopup.openNewPopup(PopupActions.LINK_WALLET, this.arkaneConnect._bearerTokenProvider);
    }
}

export interface Account {
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
