import ENV              from '../../env';
import { EVENT_TYPES }  from '../types/EventTypes';
import * as QueryString from "querystring";

export default class Utils {
    public static environment: string = 'prod';

    public static get env() {
        const env: any = ENV;
        switch (Utils.environment) {
            case 'local':
            case 'tst1':
                env.CONNECT_JS_REALM_PUBLIC_KEY = env.CONNECT_JS_REALM_PUBLIC_KEY_TST1;
                break;
            case 'staging':
                env.CONNECT_JS_REALM_PUBLIC_KEY = env.CONNECT_JS_REALM_PUBLIC_KEY_STAGING;
                break;
            default:
                env.CONNECT_JS_REALM_PUBLIC_KEY = env.CONNECT_JS_REALM_PUBLIC_KEY_PROD;
        }
        return env;
    }

    public static get urls() {
        let prefix = '';

        switch (Utils.environment) {
            case 'local':
                prefix = '-tst1';
                break;
            case 'tst1':
                prefix = '-tst1';
                break;
            case 'staging':
                prefix = '-staging';
                break;
        }

        return {
            api: `https://api${prefix}.arkane.network/api`,
            connectJS: Utils.environment === 'local' ? 'http://localhost:8081' : `https://connect-js${prefix}.arkane.network`,
            connectWeb: Utils.environment === 'local' ? 'http://localhost:8081' : `https://connect${prefix}.arkane.network`,
            login: `https://login${prefix}.arkane.network/auth`,
        };
    }

    public static removeNulls(obj: any): any {
        return Object.keys(obj)
                     .filter((key) => obj[key] !== null && obj[key] !== undefined)  // Remove undef. and null.
                     .reduce((newObj, key) => {
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
                     .reduce((newObj, key) => {
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
                return message.origin === Utils.urls.connectWeb;
            },
            hasType: (message: MessageEvent) => {
                return message.data && message.data.type && message.data.type !== '';
            },
            isOfType: (message: MessageEvent, eventType: EVENT_TYPES) => {
                return Utils.messages().hasType(message) && message.data.type === eventType.toString();
            },
            hasCorrectCorrelationID(message: MessageEvent, correlationID: string) {
                return message.data && message.data.correlationID === correlationID;
            }
        };
    }

    public static formatNumber(value: number, minDecimals: number = 2, maxDecimals: number = minDecimals) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: minDecimals,
            maximumFractionDigits: maxDecimals,
        }).format(value);
    }

    public static rawValue() {
        return {
            toTokenValue: (rawValue: number, decimals: number) => rawValue / Math.pow(10, decimals),
            toGwei: (rawValue: number) => rawValue / Math.pow(10, 9),
        };
    }

    public static gwei() {
        return {
            toRawValue: (rawValue: number) => rawValue * Math.pow(10, 9),
        };
    }

    public static openExternalUrl(url: string, targetBlank: boolean = true): Window | null {
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

    public static http() {
        return {
            postInForm: (to: string, data: any, bearerTokenProvider: () => string, options?: { redirectUri?: string, correlationID?: string }): void => {
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
                inputData.value = JSON.stringify({...data});
                form.appendChild(inputData);

                document.body.appendChild(form);
                form.submit();
            },
            buildUrl: (to: string, options ?: { redirectUri?: string; correlationID?: string }): string => {
                if (options) {
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
            addRequestParams: (url: string, params: { [key: string]: string }): string => {
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
}
