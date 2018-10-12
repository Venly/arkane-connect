import ENV from '../../vue.env';
import store from '../store';
import {Wallet} from '../models/Wallet';
import {EVENT_TYPES} from '../types/EventTypes';

export default class Utils {
    public static environment: string = 'prod';

    public static wallets = {
        filterWalletsForChainType: (wallets: Wallet[], chain: string): Wallet[] => {
            return wallets.filter((wallet: Wallet) => {
                return wallet.secretType === store.getters.secretType;
            });
        },
        hasWalletsForChainType: (wallets: Wallet[], chain: string): boolean => {
            return Utils.wallets.filterWalletsForChainType(wallets, chain).length > 0;
        },
    };

    public static get env() {
        const env: any = ENV;
        switch (Utils.environment) {
            case 'local':
            case 'tst1':
                env.VUE_APP_REALM_PUBLIC_KEY = env.VUE_APP_REALM_PUBLIC_KEY_TST1;
                break;
            case 'staging':
                env.VUE_APP_REALM_PUBLIC_KEY = env.VUE_APP_REALM_PUBLIC_KEY_STAGING;
                break;
            default:
                env.VUE_APP_REALM_PUBLIC_KEY = env.VUE_APP_REALM_PUBLIC_KEY_PROD;

        }
        return env;
    }

    public static getOrigin(url: string) {
        const parts: any = url.match(/^.+\:\/\/[^\‌​/]+/);
        return (Array.isArray(parts) && parts.length > 0) ? parts[0] : 'unknown';
    }

    public static shuffleArray(array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
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
            connect: Utils.environment === 'local' ? 'http://localhost:8081' : `https://connect${prefix}.arkane.network`,
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

    public static messages() {
        return {
            hasValidOrigin: (message: MessageEvent) => {
                return message.origin === Utils.urls.connect;
            },
            hasType: (message: MessageEvent) => {
                return message.data && message.data.type && message.data.type !== '';
            },
            isOfType: (message: MessageEvent, eventType: EVENT_TYPES) => {
                return Utils.messages().hasType(message) && message.data.type === eventType;
            },
        };
    }

    public static formatNumber(value: number, decimals: number = 2) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(value);
    }
}
