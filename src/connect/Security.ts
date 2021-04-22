import { KeycloakConfig, KeycloakInitOptions, KeycloakInstance, KeycloakLoginOptions } from 'keycloak-js';
import QueryString                                                                     from 'querystring';

import { AuthenticationOptions } from './connect';
import { WindowMode }            from '../models/WindowMode';
import { PopupWindow }           from '../popup/PopupWindow';
import { EventTypes }            from '../types/EventTypes';
import Utils                     from '../utils/Utils';

export class Security {

    public static onTokenUpdate: (token: string) => void;

    public static getConfig(clientId?: string): any {
        return {
            'clientId': clientId || Utils.env.CONNECT_JS_CLIENT_ID,
            'realm': Utils.env.CONNECT_JS_REALM,
            'url': Utils.urls.login,
            'ssl-required': Utils.env.CONNECT_JS_SSL_REQUIRED,
            'public-client': Utils.env.CONNECT_JS_PUBLIC_CLIENT,
        };
    }

    public static login(clientId: string,
                        options?: AuthenticationOptions): Promise<LoginResult> {
        switch (options && options.windowMode) {
            case WindowMode.POPUP:
                return Security.loginPopup(clientId, options);
            // case WindowMode.IFRAME:
            //     return Security.initLoginIFrame(clientId, options && options.iFrameSelector || '#login-iframe');
            default:
                return Security.loginRedirect(clientId, options);
        }
    }

    // public static initLoginIFrame(clientId: string, iFrameSelector: string) {
    //     return new Promise(async (resolve: (value?: LoginResult | PromiseLike<LoginResult>) => void, reject: (reason?: any) => void) => {
    //         Security.loginListener = await Security.createLoginListener(clientId, EventTypes.AUTHENTICATE, resolve, reject);
    //         window.addEventListener('message', Security.loginListener);
    //         Security.initialiseLoginIFrame(clientId, iFrameSelector);
    //     }) as Promise<LoginResult>;
    // }

    private static loginRedirect(clientId: string,
                                 options?: AuthenticationOptions): Promise<LoginResult> {
        let config = Security.getConfig(clientId);
        const loginOptions: KeycloakLoginOptions = {};
        if (options && options.idpHint) {
            loginOptions.idpHint = options.idpHint
        }
        return this.keycloakLogin(config, options);
    }

    private static loginPopup(clientId: string,
                              options?: AuthenticationOptions): Promise<LoginResult> {
        const closePopup = options ? options.closePopup : true;
        return Promise.race([
            Security.initialiseAuthenticatedListener(clientId, EventTypes.AUTHENTICATE, closePopup),
            Security.initialiseLoginPopup(clientId, options),
        ]);
    }

    public static checkAuthenticated(clientId: string): Promise<LoginResult> {
        const authenticatedPromise = Security.initialiseAuthenticatedListener(clientId, EventTypes.CHECK_AUTHENTICATED);
        Security.initialiseCheckAuthenticatedIFrame(clientId);
        return authenticatedPromise;
    }

    public static logout(auth: Keycloak.KeycloakInstance): Promise<void> {
        if (auth.authenticated && auth.clientId) {
            return new Promise<void>(async (resolve: () => void,
                                            reject: (reason?: any) => void) => {
                if (auth.clientId) {
                    const params: any = {
                        client_id: auth.clientId,
                        refresh_token: auth.refreshToken
                    };

                    const searchParams = Object.keys(params).map((key) => {
                        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
                    }).join('&');

                    await fetch(Utils.urls.login + '/realms/Arkane/protocol/openid-connect/logout', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                        },
                        body: searchParams
                    });

                    Security.logoutListener = await Security.createLogoutListener(EventTypes.LOGOUT, auth, resolve, reject);
                    window.addEventListener('message', Security.logoutListener);
                    Security.initialiseLogoutIFrame(auth.clientId);
                }
            });
        } else {
            return Promise.resolve();
        }
    }

    private static keycloak: KeycloakInstance;

    private static updateTokenInterval: any;
    private static authenticatedListener: any;
    private static popupWindow: PopupWindow;
    private static logoutListener: any;
    private static isLoginPopupClosedInterval?: any;

    private static readonly AUTH_IFRAME_ID = 'arkane-auth-iframe';
    private static readonly LOGOUT_IFRAME_ID = 'arkane-logout-iframe';

    private static get checkAuthenticatedURI() {
        return `${Utils.urls.connect}/checkAuthenticated`;
    }

    private static get authenticateURI() {
        return `${Utils.urls.connect}/authenticate`;
    }

    private static get logoutURI() {
        return `${Utils.urls.connect}/logout`;
    }

    private static initialiseAuthenticatedListener = async function(clientId: string,
                                                                    eventType: EventTypes,
                                                                    closePopup?: boolean) {
        return new Promise((resolve: (value: LoginResult) => void,
                            reject: any) => {
            Security.authenticatedListener = async (message: MessageEvent) => {
                if (message && message.origin === Utils.urls.connect && message.data && message.data.type === eventType) {
                    if (Security.isLoginPopupClosedInterval) {
                        Security.clearIsLoginPopupClosedInterval();
                    }
                    if (message.data.authenticated) {
                        try {
                            Security.cleanUp(eventType, closePopup);
                            const keycloakResult = message.data.keycloak;
                            const initOptions: KeycloakInitOptions = {
                                onLoad: 'check-sso',
                                token: keycloakResult.token,
                                refreshToken: keycloakResult.refreshToken,
                                idToken: keycloakResult.idToken,
                                timeSkew: keycloakResult.timeSkew,
                                checkLoginIframe: false,
                            };
                            // Remove the login state from the URL when tokens are already present (the checkAuthenticated iframe already handled it)
                            Security.removeLoginState();
                            const loginResult = await Security.initKeycloak(Security.getConfig(clientId), initOptions);
                            resolve({
                                keycloak: loginResult.keycloak,
                                authenticated: loginResult.authenticated,
                                popupWindow: Security.popupWindow
                            })
                        } catch (e) {
                            reject({error: e});
                        }
                    } else {
                        resolve({authenticated: false});
                    }
                }
            };
            window.addEventListener('message', Security.authenticatedListener);
        });
    };

    private static createLogoutListener = async function(eventType: EventTypes,
                                                         auth: Keycloak.KeycloakInstance,
                                                         resolve: () => void,
                                                         reject: any) {
        return (message: MessageEvent) => {
            if (message && message.origin === Utils.urls.connect && message.data && message.data.type === eventType) {
                if (auth.authenticated) {
                    if (!message.data.authenticated) {
                        auth.onAuthLogout && auth.onAuthLogout();
                        resolve();
                    } else {
                        reject();
                    }
                } else {
                    resolve();
                }
            }
        }
    };

    private static initialiseLoginPopup(clientId: string,
                                        options?: AuthenticationOptions): Promise<LoginResult> {
        const origin = window.location.href.replace(window.location.search, '');
        let url = `${Security.authenticateURI}?${QueryString.stringify({clientId: clientId, origin: origin, env: Utils.rawEnvironment})}`;
        if (options && options.idpHint) {
            let kcIdpHint = options.idpHint;
            if (kcIdpHint === 'twitter' || kcIdpHint === 'facebook') {
                kcIdpHint = 'arkane-' + kcIdpHint;
            }
            url += "&" + QueryString.stringify({kc_idp_hint: kcIdpHint});
        }
        Security.popupWindow = PopupWindow.openNew(url, {useOverlay: false});
        return Security.initialiseIsLoginPopupClosedInterval();
    }

    private static initialiseIsLoginPopupClosedInterval(): Promise<LoginResult> {
        return new Promise((resolve: (value: LoginResult) => void,
                            reject: any) => {
            Security.isLoginPopupClosedInterval = window.setInterval(() => {
                if (Security.popupWindow.closed) {
                    Security.clearIsLoginPopupClosedInterval();
                    Security.cleanUp(EventTypes.AUTHENTICATE);
                    resolve({authenticated: false});
                }
            }, 2000);
        });
    }

    private static clearIsLoginPopupClosedInterval() {
        clearInterval(Security.isLoginPopupClosedInterval);
        delete Security.isLoginPopupClosedInterval;
    }

    // private static initialiseLoginIFrame(clientId: string, iframeSelector: string): HTMLIFrameElement {
    //     const iframe = document.querySelector(iframeSelector) as HTMLIFrameElement;
    //     const origin = window.location.href.replace(window.location.search, '');
    //     iframe.src = `${Security.authenticateURI}?${QueryString.stringify({clientId: clientId, origin: origin, env: Utils.rawEnvironment})}`;
    //     return iframe;
    // }

    private static initialiseCheckAuthenticatedIFrame(clientId: string): HTMLIFrameElement {
        return this.initialiseIFrame(clientId, Security.AUTH_IFRAME_ID, Security.checkAuthenticatedURI);
    }

    private static initialiseLogoutIFrame(clientId: string): HTMLIFrameElement {
        return this.initialiseIFrame(clientId, Security.LOGOUT_IFRAME_ID, Security.logoutURI);
    }

    private static initialiseIFrame(clientId: string,
                                    iframeID: string,
                                    uri: string): HTMLIFrameElement {
        let iframe = document.getElementById(iframeID) as HTMLIFrameElement;
        let isIframeInBody = true;
        if (!iframe) {
            isIframeInBody = false;
            iframe = document.createElement('iframe') as HTMLIFrameElement;
        }

        const origin = window.location.href.replace(window.location.search, '');
        iframe.src = `${uri}?${QueryString.stringify({clientId: clientId, origin: origin, env: Utils.rawEnvironment})}`;
        iframe.hidden = true;
        iframe.id = iframeID;
        iframe.setAttribute('style', 'display: none!important;');
        document.body.appendChild(iframe);
        if (!isIframeInBody) {
            document.body.appendChild(iframe);
        }
        return iframe;
    }

    private static setUpdateTokenInterval() {
        if (Security.updateTokenInterval) {
            clearInterval(Security.updateTokenInterval);
            Security.updateTokenInterval = null;
        }
        Security.updateTokenInterval = setInterval(
            async () => {
                new Promise((resolve,
                             reject) => {
                    if (Security.keycloak) {
                        Security.keycloak.updateToken(70).then((refreshed: any) => {
                            resolve(refreshed);
                        });
                    } else {
                        reject(false);
                    }
                }).then((refreshed: any) => {
                    if (refreshed) {
                        if (Security.onTokenUpdate && Security.keycloak.token) {
                            Security.onTokenUpdate(Security.keycloak.token);
                        }
                    }
                }).catch(() => {
                    (console as any).error('failed to refresh token');
                    clearInterval(Security.updateTokenInterval);
                    Security.updateTokenInterval = null;
                });
            },
            60000,
        );
    }

    private static async keycloakLogin(config: any,
                                       loginOptions?: KeycloakLoginOptions): Promise<LoginResult> {
        const Keycloak: { default: (config?: KeycloakConfig | string | undefined) => KeycloakInstance } = await import ('keycloak-js');
        Security.keycloak = Keycloak.default(config);
        return new Promise((resolve,
                            reject) => {
            Security.keycloak
                    .init({}).then(() => Security.keycloak
                                                 .login(loginOptions)
                                                 .then((authenticated: any) => {
                                                     if (authenticated) {
                                                         Security.setUpdateTokenInterval();
                                                     }
                                                     resolve({
                                                         keycloak: Security.keycloak,
                                                         authenticated,
                                                     } as LoginResult);
                                                 })
                                                 .catch((e) => {
                                                     reject(e);
                                                 }));

        });
    }

    private static async initKeycloak(config: any,
                                      initOptions: Keycloak.KeycloakInitOptions): Promise<LoginResult> {
        const Keycloak: { default: (config?: KeycloakConfig | string | undefined) => KeycloakInstance } = await import ('keycloak-js');
        Security.keycloak = Keycloak.default(config);
        return new Promise((resolve,
                            reject) => {
            Security.keycloak
                    .init(initOptions)
                    .then((authenticated: any) => {
                        if (authenticated) {
                            Security.setUpdateTokenInterval();
                        }
                        resolve({
                            keycloak: Security.keycloak,
                            authenticated,
                        } as LoginResult);
                    })
                    .catch((e) => {
                        reject(e);
                    });
        });
    }

    private static removeLoginState(): void {
        const url = window.location.href;
        const fragmentIndex = url.indexOf('#');
        if (fragmentIndex !== -1) {
            const newURL = url.substring(0, fragmentIndex);
            window.history.replaceState({}, '', newURL);
        }
    }

    private static cleanUp(eventType: EventTypes,
                           closePopup: boolean = true) {
        if (Security.authenticatedListener) {
            window.removeEventListener('message', Security.authenticatedListener);
            delete Security.authenticatedListener;
        }
        if (eventType === EventTypes.CHECK_AUTHENTICATED) {
            const iframe = document.getElementById(Security.AUTH_IFRAME_ID);
            if (iframe) {
                iframe.remove();
            }
        } else if (eventType === EventTypes.AUTHENTICATE) {
            if (closePopup && Security.popupWindow && !Security.popupWindow.closed) {
                Security.popupWindow.close();
            }
        }
    }
}

export interface LoginResult {
    keycloak?: KeycloakInstance;
    authenticated: boolean;
    popupWindow?: PopupWindow;
}
