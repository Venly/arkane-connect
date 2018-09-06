import Keycloak, {KeycloakInstance} from 'keycloak-js';

import * as KJUR from 'jsrsasign';
import Api from './api';
import Utils from './utils/Utils';

export default class Security {
    public static isLoggedIn = false;

    public static getConfig(clientId: string): any {
        return {
            'clientId': clientId || Utils.env.VUE_APP_CLIENT_ID,
            'realm': Utils.env.VUE_APP_REALM,
            'realm-public-key': Utils.env.VUE_APP_REALM_PUBLIC_KEY,
            'url': Utils.urls.login,
            'auth-server-url': Utils.urls.login,
            'ssl-required': Utils.env.VUE_APP_SSL_REQUIRED,
            'resource': clientId,
            'public-client': Utils.env.VUE_APP_PUBLIC_CLIENT,
        };
    }

    public static login(clientId: string) {
        return Security.initializeAuth(Security.getConfig(clientId));
    }

    public static verifyAndLogin(
        clientId: string, token: string,
        environment: string, useTokenToLogin: boolean = true,
    ): Promise<any> {
        const config = Security.getConfig(clientId);
        const tokenParsed = Security.verifyToken(token, config['realm-public-key']);
        if (tokenParsed) {
            return Security.initializeAuth(Object.assign(config, {
                clientId: useTokenToLogin ? tokenParsed.aud : config.clientId,
                resource: useTokenToLogin ? tokenParsed.aud : config.resource,
            }));
        } else {
            Security.notAuthenticated();
            return Promise.resolve({keycloak: {}, authenticated: false});
        }
    }

    private static keycloak: KeycloakInstance;
    private static updateTokenInterval: any;

    private static setUpdateTokenInterval() {
        if (Security.updateTokenInterval) {
            clearInterval(Security.updateTokenInterval);
            Security.updateTokenInterval = null;
        }
        Security.updateTokenInterval = setInterval(async () => {
            new Promise((resolve, reject) => {
                if (Security.keycloak) {
                    Security.keycloak.updateToken(70).success((refreshed: any) => {
                        resolve(refreshed);
                    });
                } else {
                    reject(false);
                }
            }).then((refreshed: any) => {
                if (refreshed) {
                    Security.authenticated(Security.keycloak.token);
                }
            }).catch(() => {
                (console as any).error('failed to refresh token');
                Security.notAuthenticated();
                clearInterval(Security.updateTokenInterval);
                Security.updateTokenInterval = null;
            });
        }, 60000);
    }

    private static verifyToken(token: string, publicKey: string): any {
        const jws = new KJUR.jws.JWS();
        try {
            jws.parseJWS(token);
            if (publicKey.indexOf('-----BEGIN PUBLIC KEY-----') === -1) {
                publicKey = `-----BEGIN PUBLIC KEY-----${publicKey}-----END PUBLIC KEY-----`;
            }
            const parsedToken = JSON.parse(jws.parsedJWS.payloadS);
            const result = KJUR.jws.JWS.verifyJWT(token, publicKey, {alg: ['RS256']});

            return result ? parsedToken : false;
        } catch (e) {
            return false;
        }
    }

    private static initializeAuth(config: any): Promise<any> {
        return new Promise((resolve, reject) => {
            Security.keycloak = Keycloak(config);
            Security.keycloak.init({
                onLoad: 'check-sso',
            }).success((authenticated: any) => {
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
            }).error(() => {
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
