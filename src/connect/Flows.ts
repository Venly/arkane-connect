import Utils                                                         from '../utils/Utils';
import { Account }                                                   from '../models/Account';
import { AuthenticationOptions, AuthenticationResult, VenlyConnect } from './connect';
import { GeneralPopup }                                              from '../popup/GeneralPopup';
import { PopupActions }                                              from '../popup/PopupActions';
import { PopupResult }                                               from '../popup/PopupResult';
import { Security }                                                  from './Security';
import { SecretType }                                                from '../models/SecretType';
import { Wallet }                                                    from '../models/wallet/Wallet';
import { WindowMode }                                                from '../models/WindowMode';
import { PopupOptions }                                              from '../popup/Popup';

export class Flows {
    private clientId: string;
    private connect: VenlyConnect;

    constructor(venlyConnect: VenlyConnect,
                clientId: string) {
        this.clientId = clientId;
        this.connect = venlyConnect;
    }

    public async authenticate(options?: AuthenticationOptions): Promise<AuthenticationResult> {
        let authOptions: AuthenticationOptions = {...options};
        authOptions.windowMode = authOptions.windowMode || this.connect.windowMode;
        const loginResult = await Security.login(this.clientId, authOptions);
        return this.connect._afterAuthenticationForFlowUse(loginResult);
    }

    public manageWallets(chain: string,
                         options?: { redirectUri?: string, correlationID?: string, windowMode?: WindowMode, useOverlayWithPopup?: boolean }): Promise<PopupResult | void> {
        const windowMode = options && options.windowMode || this.connect.windowMode;

        const useOverlayWithPopup = options && options.useOverlayWithPopup != undefined ? options.useOverlayWithPopup : this.connect.useOverlayWithPopup;
        if (windowMode === WindowMode.REDIRECT) {
            return this.manageWalletsRedirect(chain, options);
        } else {
            return this.manageWalletsPopup(chain, {useOverlay: useOverlayWithPopup});
        }
    }

    public linkWallets(options?: { redirectUri?: string, correlationID?: string, windowMode?: WindowMode, useOverlayWithPopup?: boolean }): Promise<PopupResult | void> {
        const windowMode = options && options.windowMode || this.connect.windowMode;
        const useOverlayWithPopup = options && options.useOverlayWithPopup != undefined ? options.useOverlayWithPopup : this.connect.useOverlayWithPopup;
        if (windowMode === WindowMode.REDIRECT) {
            return this.linkWalletsRedirect(options);
        } else {
            return this.linkWalletsPopup({useOverlay: useOverlayWithPopup});
        }
    }

    public claimWallets(options?: { redirectUri?: string, correlationID?: string, windowMode?: WindowMode, useOverlayWithPopup?: boolean }): Promise<PopupResult | void> {
        const windowMode = options && options.windowMode || this.connect.windowMode;
        const useOverlayWithPopup = options && options.useOverlayWithPopup || this.connect.useOverlayWithPopup;
        if (windowMode === WindowMode.REDIRECT) {
            return this.claimWalletsRedirect(options);
        } else {
            return this.claimWalletsPopup({useOverlay: useOverlayWithPopup});
        }
    }

    public async getAccount(chain: SecretType,
                            options?: { idpHint?: string }): Promise<Account> {
        let loginResult: any = {};
        let wallets: Wallet[] = [];
        const correlationId = Utils.uuidv4();

        try {
            // POPUP is mandatory for this flow
            const authenticationOptions: AuthenticationOptions = {windowMode: WindowMode.POPUP, closePopup: false};
            if (options && options.idpHint) {
                authenticationOptions.idpHint = options.idpHint;
            }
            loginResult = await Security.login(this.clientId, authenticationOptions, correlationId);

            let result = this.connect._afterAuthenticationForFlowUse(loginResult);

            if (result.isAuthenticated) {
                wallets = await this.connect.api.getWallets({secretType: chain.toUpperCase() as SecretType});
                if (!(wallets && wallets.length > 0)) {
                    const popupResult = await this.manageWallets(chain, {windowMode: WindowMode.POPUP});
                    if (popupResult && popupResult.status === 'SUCCESS') {
                        wallets = await this.connect.api.getWallets({secretType: chain.toUpperCase() as SecretType});
                    }
                }
            }
            if (!result.isAuthenticated || wallets.length === 0) {
                throw Error('Something went wrong.');
            }
        } catch (e) {
            console.error(e);
        }

        if (Security.hasPopupWindow(correlationId)) {
            Security.closePopupWindow(correlationId);
        }

        return {
            wallets: wallets,
            auth: loginResult.keycloak,
            isAuthenticated: loginResult.authenticated
        }
    }

    private manageWalletsRedirect(chain: string,
                                  options?: { redirectUri?: string, correlationID?: string }): Promise<void> {
        Utils.http().postInForm(
            `${Utils.urls.connect}/wallets/manage`,
            {chain: chain.toLowerCase()},
            this.connect._bearerTokenProvider,
            options
        );
        return Promise.resolve();
    }

    private manageWalletsPopup(chain: string,
                               options: PopupOptions): Promise<PopupResult> {
        return GeneralPopup.openNewPopup(PopupActions.MANAGE_WALLETS, this.connect._bearerTokenProvider, {chain: chain.toLowerCase()}, options);
    }

    private linkWalletsRedirect(options?: { redirectUri?: string, correlationID?: string }): Promise<void> {
        Utils.http().postInForm(
            `${Utils.urls.connect}/wallets/link`,
            {},
            this.connect._bearerTokenProvider,
            options
        );
        return Promise.resolve();
    }

    private linkWalletsPopup(options?: PopupOptions): Promise<PopupResult> {
        return GeneralPopup.openNewPopup(PopupActions.LINK_WALLET, this.connect._bearerTokenProvider, undefined, options);
    }

    private claimWalletsRedirect(options?: { redirectUri?: string, correlationID?: string }): Promise<void> {
        Utils.http().postInForm(
            `${Utils.urls.connect}/wallets/claim`,
            {},
            this.connect._bearerTokenProvider,
            options
        );
        return Promise.resolve();
    }

    private claimWalletsPopup(options?: PopupOptions): Promise<PopupResult> {
        return GeneralPopup.openNewPopup(PopupActions.CLAIM_WALLETS, this.connect._bearerTokenProvider, undefined, options);
    }
}
