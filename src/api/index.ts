// this is aliased in webpack config based on server/client build
import RestApi from './RestApi';
import {AxiosResponse} from 'axios';
import EthereumTransactionData from '@/api/EthereumTransactionData';
import ResponseBody from '@/api/ResponseBody';

export default class Api {
    // TODO: error handling
    public static signEthereumTransaction(data: EthereumTransactionData, pincode: string): Promise<ResponseBody> {
        return Api.getApi().http.post('signatures', Object.assign(data, {pincode}))
            .then((axiosRes: AxiosResponse) => axiosRes.data as ResponseBody)
            .catch((e: Error) => {
                return {
                    success: false,
                    result: {},
                };
            });
    }

    private static defaultBaseUrl = 'https://api-tst1.arkane.network/api';
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

    public constructor(baseUrl?: string) {
        this.api = new RestApi(baseUrl || Api.defaultBaseUrl);
    }
}
