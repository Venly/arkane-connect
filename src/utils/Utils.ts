import ENV              from '../env';
import { EventTypes }   from '../types/EventTypes';
import * as QueryString from 'querystring';

export default class Utils {

    private static rawEnvironmentHolder: string = '';
    public static environment: string = '';
    public static connectEnvironment: string = '';

    public static set rawEnvironment(env: string) {
        Utils.rawEnvironmentHolder = env;
        const split = env.split('-');
        Utils.environment = split[0];
        Utils.connectEnvironment = split.length > 1 && split[1] || '';
    };

    public static get rawEnvironment() {
        return Utils.rawEnvironmentHolder;
    }

    public static get env() {
        return ENV;
    }

    public static environments(): { [key: string]: { api: string, connect: string, login: string }; } {
        return {
            'qa': {
                api: 'https://api-wallet-qa.venly.io/api',
                connect: 'https://connect-qa.venly.io',
                login: 'https://login-qa.arkane.network/auth',
            },
            'staging': {
                api: 'https://api-wallet-staging.venly.io/api',
                connect: 'https://connect-staging.venly.io',
                login: 'https://login-staging.arkane.network/auth',
            },
        }
    }

    public static get urls(): { api: string, connect: string, login: string } {
        let postfix = '';
        switch (Utils.environment) {
            case 'local':
                postfix = 'qa';
                break;
            case 'prod':
            case 'production':
                postfix = '';
                break;
            default:
                postfix = Utils.environment;
        }

        const environment = this.environments()[postfix];
        if (environment) {
            return {
                api: environment.api,
                connect: Utils.environment === 'local' || Utils.connectEnvironment === 'local' ? 'http://127.0.0.1:8181' : environment.connect,
                login: environment.login,
            }
        } else {
            return {
                api: `https://api-wallet.venly.io/api`,
                connect: `https://connect.venly.io`,
                login: `https://login.arkane.network/auth`,
            };
        }
    }

    public static removeNulls(obj: any): any {
        return Object.keys(obj)
                     .filter((key) => obj[key] !== null && obj[key] !== undefined)  // Remove undef. and null.
                     .reduce((newObj,
                              key) => {
                         if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                             return Object.assign(newObj, {[key]: Utils.removeNulls(obj[key])});
                         } else {
                             return Object.assign(newObj, {[key]: obj[key]});
                         }
                     }, {});
    }

    public static removeNullsAndEmpty(obj: any): any {
        return Object.keys(obj)
                     .filter((key) => obj[key] !== null && obj[key] !== undefined && obj[key] !== '')  // Remove undef. and null.
                     .reduce((newObj,
                              key) => {
                         if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                             return Object.assign(newObj, {[key]: Utils.removeNullsAndEmpty(obj[key])});
                         } else {
                             return Object.assign(newObj, {[key]: obj[key]});
                         }
                     }, {});
    }


    public static messages() {
        return {
            hasValidOrigin: (message: MessageEvent) => {
                return message.origin === Utils.urls.connect;
            },
            hasType: (message: MessageEvent) => {
                return message.data && message.data.type && message.data.type !== '';
            },
            isOfType: (message: MessageEvent,
                       eventType: EventTypes) => {
                return Utils.messages().hasType(message) && message.data.type === eventType.toString();
            },
            hasCorrectCorrelationID(message: MessageEvent,
                                    correlationID: string) {
                return message.data && message.data.correlationID === correlationID;
            }
        };
    }

    public static formatNumber(value: number,
                               minDecimals: number = 2,
                               maxDecimals: number = minDecimals) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: minDecimals,
            maximumFractionDigits: maxDecimals,
        }).format(value);
    }

    public static rawValue() {
        return {
            toTokenValue: (rawValue: number,
                           decimals: number) => rawValue / Math.pow(10, decimals),
            toGwei: (rawValue: number) => rawValue / Math.pow(10, 9),
        };
    }

    public static gwei() {
        return {
            toRawValue: (rawValue: number) => rawValue * Math.pow(10, 9),
        };
    }

    public static openExternalUrl(url: string,
                                  targetBlank: boolean = true): Window | null {
        if (targetBlank) {
            const newWindow = window.open('', '_blank');
            if (newWindow) {
                newWindow.opener = null;
                newWindow.location.assign(url);
            }

            return newWindow;
        } else {
            window.location.href = url;
            return window;
        }
    }

    public static zeroIfUndefined(numberToVerify?: number): number {
        return numberToVerify ? numberToVerify : 0;
    }

    public static defaultRedirectUriIfNotPresent(options: { redirectUri?: string; correlationID?: string } = {}): { redirectUri?: string; correlationID?: string } {
        if (!options.redirectUri) {
            options.redirectUri = window.location.href;
        }
        return options;
    }

    public static http() {
        return {
            postInForm: (to: string,
                         request: any,
                         bearerTokenProvider: () => string,
                         options?: { redirectUri?: string, correlationID?: string }): void => {
                options = Utils.defaultRedirectUriIfNotPresent(options);

                const form = document.createElement('form');
                form.action = Utils.http().buildUrl(to, options);
                form.method = 'POST';

                const inputBearer = document.createElement('input');
                inputBearer.type = 'hidden';
                inputBearer.name = 'bearerToken';
                inputBearer.value = bearerTokenProvider();
                form.appendChild(inputBearer);

                const inputData = document.createElement('input');
                inputData.type = 'hidden';
                inputData.name = 'data';
                inputData.value = JSON.stringify({...request});
                form.appendChild(inputData);

                document.body.appendChild(form);
                form.submit();
            },
            buildUrl: (to: string,
                       options ?: { redirectUri?: string; correlationID?: string }): string => {
                if (options && (options.redirectUri || options.correlationID)) {
                    const params: { [key: string]: string } = {};
                    if (options.redirectUri) {
                        params.redirectUri = options.redirectUri;
                    }
                    if (options.correlationID) {
                        params.cid = options.correlationID;
                    }
                    return Utils.http().addRequestParams(to, params);
                }
                return to;
            },
            addRequestParams: (url: string,
                               params: { [key: string]: string }): string => {
                if (url && params) {
                    const paramsAsString = QueryString.stringify(params);
                    if (url && url.indexOf('?') > 0) {
                        return `${url}&${paramsAsString}`;
                    } else {
                        return `${url}?${paramsAsString}`;
                    }
                }
                return url;
            }
        };
    }

    public static uuidv4(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
