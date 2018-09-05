// this is aliased in webpack config based on server/client build
import {AxiosError, AxiosResponse} from 'axios';
import RestApi from '@/api/RestApi';
import ResponseBody from '@/api/ResponseBody';

export default class Api {
    // TODO: error handling
    public static signTransaction(data: any, pincode: string): Promise<ResponseBody> {
        return Api.getApi().http.post('signatures', Object.assign(data, {pincode}))
            .then((axiosRes: AxiosResponse) => axiosRes.data as ResponseBody)
            .catch((e: AxiosError) => {
                return {
                    success: false,
                    result: e.response.data,
                };
            });
    }

    private static defaultBaseUrl = process.env.VUE_APP_API_URI || '';
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
