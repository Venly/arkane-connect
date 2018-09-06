import ENV from '../../vue.env';

export default class Utils {
    public static environment: string = 'prod';

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

    public static isWhitelistedOrigin(origin: string): boolean {
        // const array = ['http://localhost:4000'];
        // return !!array.find((val: string) => val === origin);
        return true;
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
            connect: Utils.environment === 'local' ?
                'http://localhost:8081' : `https://connect${prefix}.arkane.network`,
            login: `https://login${prefix}.arkane.network/auth`,
        };
    }
}
