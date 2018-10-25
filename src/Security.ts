import Keycloak, {KeycloakInitOptions, KeycloakInstance} from 'keycloak-js';

import * as KJUR from 'jsrsasign';
import Api from './api';
import Utils from './utils/Utils';

export default class Security {
    public static isLoggedIn = false;
    public static onTokenUpdate: (token: string) => void;

    public static getConfig(clientId?: string): any {
        return {
            'clientId': clientId || Utils.env.VUE_APP_CLIENT_ID,
            'clientSecret': 'secret',
            'realm': Utils.env.VUE_APP_REALM,
            'realm-public-key': Utils.env.VUE_APP_REALM_PUBLIC_KEY,
            'url': Utils.urls.login,
            'auth-server-url': Utils.urls.login,
            'ssl-required': Utils.env.VUE_APP_SSL_REQUIRED,
            'resource': clientId,
            'public-client': Utils.env.VUE_APP_PUBLIC_CLIENT,
        };
    }

    public static login(clientId: string): Promise<LoginResult> {
        return Security.initializeAuth(Security.getConfig(clientId), 'login-required');
    }

    public static checkAuthenticated(clientId: string): Promise<LoginResult> {
        return Security.initializeAuth(Security.getConfig(clientId), 'check-sso');
    }

    public static verifyAndLogin(rawBearerToken: string, useTokenToLogin: boolean, redirectUrl?: string): Promise<any> {
        const token = Security.parseToken(rawBearerToken);
        if (Security.verifyToken(rawBearerToken, token)) {
            const clientId = Security.resolveClientId(token, useTokenToLogin);
            const config = Security.getConfig(clientId);
            return Security.initializeAuth(config, 'check-sso', redirectUrl);
        } else {
            Security.notAuthenticated();
            return Promise.resolve({keycloak: {}, authenticated: false});
        }
    }

    public static parseToken(rawBearerToken: string): any {
        try {
            const jws = new KJUR.jws.JWS();
            jws.parseJWS(rawBearerToken);
            return JSON.parse(jws.parsedJWS.payloadS);
        } catch (e) {
            return null;
        }
    }

    private static keycloak: KeycloakInstance;
    private static updateTokenInterval: any;

    private static verifyToken(rawBearerToken: any, parsedToken: any): any {
        try {
            let publicKey = Utils.env.VUE_APP_REALM_PUBLIC_KEY;
            if (publicKey.indexOf('-----BEGIN PUBLIC KEY-----') === -1) {
                publicKey = `-----BEGIN PUBLIC KEY-----${publicKey}-----END PUBLIC KEY-----`;
            }
            return KJUR.jws.JWS.verifyJWT(rawBearerToken, publicKey, {alg: ['RS256'], verifyAt: parsedToken.iat});
        } catch (e) {
            return false;
        }
    }

    private static resolveClientId(token: any, useTokenToLogin: boolean): string {
        if (useTokenToLogin) {
            return token ? token.azp : '';
        } else {
            return process.env.VUE_APP_CLIENT_ID || '';
        }
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
                            Security.authenticated(Security.keycloak.token);
                            resolve(refreshed);
                        });
                    } else {
                        reject(false);
                    }
                }).then((refreshed: any) => {
                    if (refreshed) {
                        Security.authenticated(Security.keycloak.token);
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

    private static initializeAuth(config: any, onLoad: 'check-sso' | 'login-required', redirectUrl?: string): Promise<LoginResult> {
        return new Promise((resolve, reject) => {
            Security.keycloak = Keycloak(config);
            const initOptions: KeycloakInitOptions = {
                onLoad,
            };
            if (redirectUrl) {
                Object.assign(initOptions, {
                    redirectUri: redirectUrl,
                });
            }
            Security.keycloak.init(initOptions)
                    .success((authenticated: any) => {
                        if (authenticated) {
                            Security.authenticated(Security.keycloak.token);
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
        });
    }

    private static authenticated(token: string = '') {
        Security.isLoggedIn = true;
        Api.token = token;
    }

    private static notAuthenticated() {
        Security.isLoggedIn = false;
    }
}

export interface LoginResult {
    keycloak: KeycloakInstance;
    authenticated: boolean;
}

