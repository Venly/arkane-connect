import { KeycloakInitOptions, KeycloakInstance } from 'keycloak-js';
import Utils                                     from '../utils/Utils';
import { AuthenticationOptions }                 from './connect';
import QueryString                               from 'querystring';

export class Security {
    public static isLoggedIn = false;
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

    public static login(clientId: string, options?: AuthenticationOptions): Promise<LoginResult> {
        return Security.initializeAuth(Security.getConfig(clientId), 'login-required', options);
    }

    public static checkAuthenticated(clientId: string): Promise<LoginResult> {
        return new Promise(async (resolve: (value?: LoginResult | PromiseLike<LoginResult>) => void, reject: (reason?: any) => void) => {
            Security.checkAuthenticatedListener = await Security.createCheckAuthenticatedListener(clientId, resolve, reject);
            window.addEventListener('message', Security.checkAuthenticatedListener);
            Security.initialiseCheckAuthenticatedIFrame(clientId);
        }) as Promise<LoginResult>;
    }

    private static keycloak: KeycloakInstance;
    private static updateTokenInterval: any;
    private static checkAuthenticatedListener: any;
    private static readonly AUTH_IFRAME_ID = 'arkane-auth-iframe';

    private static get checkAuthenticatedURI() {
        return `${Utils.urls.connect}/checkAuthenticated`;
    }

    private static createCheckAuthenticatedListener = async function(clientId: string, resolve: any, reject: any) {
        return (message: MessageEvent) => {
            if (message && message.origin === Utils.urls.connect && message.data && message.data.type === 'CHECK_AUTHENTICATED') {
                try {
                    window.removeEventListener('message', Security.checkAuthenticatedListener);
                    delete Security.checkAuthenticatedListener;
                    Security.removeIFrame();
                    const keycloakResult = message.data.keycloak;
                    const initOptions: KeycloakInitOptions = {
                        onLoad: 'check-sso',
                        token: keycloakResult.token,
                        refreshToken: keycloakResult.refreshToken,
                        idToken: keycloakResult.idToken,
                        timeSkew: keycloakResult.timeSkew,
                    };
                    // Remove the login state from the URL when tokens are already present (the checkAuthenticated iframe already handled it)
                    Security.removeLoginState();
                    Security.initKeycloak(Security.getConfig(clientId), initOptions, resolve, reject);
                } catch (e) {
                    Security.notAuthenticated();
                    reject(false);
                }
            }
        };
    };

    private static initialiseCheckAuthenticatedIFrame(clientId: string): HTMLIFrameElement {
        const iframe: HTMLIFrameElement = document.createElement('iframe');
        const origin = window.location.href.replace(window.location.search, '');
        iframe.src = `${Security.checkAuthenticatedURI}?${QueryString.stringify({clientId: clientId, origin: origin, env: Utils.environment})}`;
        iframe.hidden = true;
        iframe.id = Security.AUTH_IFRAME_ID;
        document.body.appendChild(iframe);
        return iframe;
    }

    private static setUpdateTokenInterval() {
        if (Security.updateTokenInterval) {
            clearInterval(Security.updateTokenInterval);
            Security.updateTokenInterval = null;
        }
        Security.updateTokenInterval = setInterval(
            async () => {
                new Promise((resolve, reject) => {
                    if (Security.keycloak) {
                        Security.keycloak.updateToken(70).success((refreshed: any) => {
                            Security.authenticated();
                            resolve(refreshed);
                        });
                    } else {
                        reject(false);
                    }
                }).then((refreshed: any) => {
                    if (refreshed) {
                        Security.authenticated();
                        if (Security.onTokenUpdate && Security.keycloak.token) {
                            Security.onTokenUpdate(Security.keycloak.token);
                        }
                    }
                }).catch(() => {
                    (console as any).error('failed to refresh token');
                    Security.notAuthenticated();
                    clearInterval(Security.updateTokenInterval);
                    Security.updateTokenInterval = null;
                });
            },
            60000,
        );
    }

    private static async initializeAuth(config: any, onLoad: 'check-sso' | 'login-required', options?: AuthenticationOptions): Promise<LoginResult> {
        return new Promise((resolve, reject) => {
            const initOptions: KeycloakInitOptions = {
                onLoad,
            };
            if (options && options.redirectUri) {
                Object.assign(initOptions, {redirectUri: options.redirectUri});
            }
            Security.initKeycloak(config, initOptions, resolve, reject);
        });
    }

    private static async initKeycloak(config: any, initOptions: Keycloak.KeycloakInitOptions, resolve: any, reject: any) {
        const Keycloak: { default: (config?: string | {} | undefined) => KeycloakInstance } = await import ('keycloak-js');
        Security.keycloak = Keycloak.default(config);
        Security.keycloak
                .init(initOptions)
                .success((authenticated: any) => {
                    if (authenticated) {
                        Security.authenticated();
                        Security.setUpdateTokenInterval();
                    } else {
                        Security.notAuthenticated();
                    }
                    resolve({
                                keycloak: Security.keycloak,
                                authenticated,
                            });
                })
                .error(() => {
                    Security.notAuthenticated();
                    reject(false);
                });
    }

    private static removeLoginState() {
        const url = window.location.href;
        const fragmentIndex = url.indexOf('#');
        if (fragmentIndex !== -1) {
            const newURL = url.substring(0, fragmentIndex);
            window.history.replaceState({}, '', newURL);
        }
    }

    private static authenticated() {
        Security.isLoggedIn = true;
    }

    private static notAuthenticated() {
        Security.isLoggedIn = false;
    }

    private static removeIFrame() {
        const iframe = document.getElementById(Security.AUTH_IFRAME_ID);
        if (iframe) {
            iframe.remove();
        }
    }
}

export interface LoginResult {
    keycloak: KeycloakInstance;
    authenticated: boolean;
}
