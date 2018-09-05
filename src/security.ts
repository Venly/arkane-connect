import axios from 'axios';
import * as KJUR from 'jsrsasign';
import Keycloak, {KeycloakInstance} from 'keycloak-js';

export default class Security {
    public static isLoggedIn = false;

    public static verifyAndLogin(token: string, useTokenToLogin: boolean = true): Promise<any> {
        const publicKey = process.env.VUE_APP_REALM_PUBLIC_KEY || '';
        const tokenParsed = Security.verifyToken(token, publicKey);
        if (tokenParsed) {
            return Security.initializeAuth({
                'clientId': useTokenToLogin ? tokenParsed.aud : process.env.VUE_APP_CLIENT_ID,
                'realm': process.env.VUE_APP_REALM,
                'realm-public-key': process.env.VUE_APP_REALM_PUBLIC_KEY,
                'url': process.env.VUE_APP_URL,
                'auth-server-url': process.env.VUE_APP_AUTH_SERVER_URL,
                'ssl-required': process.env.VUE_APP_SSL_REQUIRED,
                'resource': useTokenToLogin ? tokenParsed.aud : process.env.VUE_APP_RESOURCE,
                'public-client': process.env.VUE_APP_PUBLIC_CLIENT,
            });
        } else {
            Security.notAuthenticated();
            return Promise.resolve({ keycloak: {}, authenticated: false });
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

    private static notAuthenticated() {
        Security.isLoggedIn = false;
        axios.defaults.headers.common = {
            Authorization: '',
        };
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

    private static initializeAuth(config: string | {}): Promise<any> {
        return new Promise((resolve, reject) => {
            const keycloak = Keycloak(config);
            keycloak.init({
                onLoad: 'check-sso',
            }).success((authenticated: any) => {
                if (authenticated) {
                    Security.authenticated(keycloak.token);
                    Security.setUpdateTokenInterval();
                } else {
                    Security.notAuthenticated();
                }
                resolve({
                    keycloak,
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
        axios.defaults.headers.common = {
            Authorization: 'Bearer ' + token,
        };
    }
}
