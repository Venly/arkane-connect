import { KeycloakInitOptions, KeycloakInstance } from 'keycloak-js';
import Utils                                     from '../utils/Utils';
import { AuthenticationOptions }                 from './connect';

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

    public static checkAuthenticated(clientId: string, options?: AuthenticationOptions): Promise<LoginResult> {
        return Security.initializeAuth(Security.getConfig(clientId), 'check-sso', options);
    }

    private static keycloak: KeycloakInstance;
    private static updateTokenInterval: any;

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
        const Keycloak: { default: (config?: string | {} | undefined) => KeycloakInstance } = await import ('keycloak-js');

        return new Promise((resolve, reject) => {
            Security.keycloak = Keycloak.default(config);
            const initOptions: KeycloakInitOptions = { onLoad, };
            if (options) {
                this.addInitOption(initOptions, options.redirectUri);
                this.addInitOption(initOptions, options.checkLoginIframe);
                this.addInitOption(initOptions, options.checkLoginIframeInterval);
            }
            Security.keycloak.init(initOptions)
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
        }) as Promise<LoginResult>;
    }

    private static authenticated() {
        Security.isLoggedIn = true;
    }

    private static notAuthenticated() {
        Security.isLoggedIn = false;
    }

    private static addInitOption(initOptions: Keycloak.KeycloakInitOptions, option?: any) {
        if (option) {
            Object.assign(initOptions, {option});
        }
    }
}

export interface LoginResult {
    keycloak: KeycloakInstance;
    authenticated: boolean;
}
