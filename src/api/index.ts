// this is aliased in webpack config based on server/client build
import {AxiosResponse} from 'axios';
import RestApi, {RestApiResponse} from './RestApi';
import ResponseBody from './ResponseBody';
import Utils from '../utils/Utils';
import {Wallet} from '../models/Wallet';
import {CreateWalletCommand} from '@/models/Commands';

export default class Api {
    public static token: string = '';

    // TODO: error handling
    public static signTransaction(data: any, pincode: string): Promise<ResponseBody> {
        return Api.getApi().http.post('signatures', Object.assign(data, {pincode}))
            .then((axiosRes: AxiosResponse) => axiosRes.data as ResponseBody)
            .catch((e: Error) => {
                return {
                    success: false,
                    result: {},
                };
            });
    }

    public static getWallets(): Promise<Wallet[]> {
        return Api.getApi().http.get('wallets').then((result: any) => {
            return result.data && result.data.success
                ? result.data.result
                : [];
        }).catch(() => {
            return [];
        });
    }

    public static getProfile(): Promise<{ userId: string, hasMasterPin: boolean }> {
        return Api.getApi().http.get('profile').then((result: any) => {
            return result.data && result.data.success
                ? result.data.result
                : {userId: '', hasMasterPin: false};
        }).catch(() => {
            return {userId: '', hasMasterPin: false};
        });
    }

    public static async setMasterPin(newPin: string, oldPin?: string): Promise<boolean> {
        return Api.getApi().http.patch('profile', Utils.removeNulls({
            pincode: oldPin,
            newPincode: newPin,
        })).then((res: AxiosResponse<RestApiResponse<any>>) => {
            return res && res.data && res.data.success;
        });
    }

    public static createWallet(command: CreateWalletCommand): Promise<Wallet> {
        return Api.getApi().http.post('wallets', Utils.removeNulls(command)).then((res: AxiosResponse<RestApiResponse<Wallet>>) => {
                return Object.assign(new Wallet(), res.data.result);
            },
        );
    }

    private static instance: Api;

    private static getInstance(): Api {
        if (!Api.instance) {
            Api.instance = new Api();
        }

        return Api.instance;
    }

    private static getApi(): RestApi {
        return Api.getInstance().api;
    }

    private api: RestApi;

    public constructor() {
        this.api = new RestApi(Utils.urls.api, undefined, Api.token);
    }
}
