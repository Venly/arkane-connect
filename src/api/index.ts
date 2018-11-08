// this is aliased in webpack config based on server/client build
import {AxiosError, AxiosResponse} from 'axios';
import RestApi, {RestApiResponse} from './RestApi';
import ResponseBody from './ResponseBody';
import Utils from '../utils/Utils';
import {Wallet} from '../models/Wallet';
import {CreateWalletCommand, ImportKeystoreCommand, ImportPrivateKeyCommand, LinkWalletCommand} from '../models/Commands';
import {Profile} from '../models/Profile';
import {Balance} from '../models/Balance';
import {SecretType} from '../models/SecretType';
import {IntercomVerification} from '../models/IntercomVerification';
import TokenBalance from '../models/TokenBalance';

export default class Api {
    public static token: string = '';

    public static signTransaction(data: any, pincode: string): Promise<ResponseBody> {
        return Api.handleTransaction('signatures', data, pincode);
    }

    public static executeTransaction(data: any, pincode: string): Promise<ResponseBody> {
        return Api.handleTransaction('transactions', data, pincode);
    }

    public static prepareSignTransaction(data: any): Promise<any> {
        return Api.prepareTransaction('signatures', data);
    }

    public static prepareExecuteTransaction(data: any): Promise<any> {
        return Api.prepareTransaction('transactions', data);
    }

    public static getWallets(filter?: { secretType?: SecretType, clientId?: string }): Promise<Wallet[]> {
        filter = (filter && Utils.removeNulls(filter)) || {};
        return Api.getApi().http
                  .get('wallets', {params: filter})
                  .then((result: any) => {
                      return result.data && result.data.success ? result.data.result : [];
                  })
                  .catch(() => {
                      return [];
                  });
    }

    public static getWallet(walletId: string): Promise<Wallet> {
        return Api.getApi().http
                  .get(`wallets/${walletId}`)
                  .then((result: any) => {
                      return result.data && result.data.success ? result.data.result : {};
                  });
    }

    public static getBalance(walletId: string): Promise<Balance> {
        return Api.getApi().http
                  .get(`wallets/${walletId}/balance`)
                  .then((result: any) => {
                      return result.data && result.data.success ? result.data.result : [];
                  })
                  .catch(() => {
                      return {
                          success: false,
                          result: {},
                      };
                  });
    }

    public static getProfile(): Promise<Profile> {
        return Api.getApi().http
                  .get('profile')
                  .then((result: any) => {
                      return result.data && result.data.success ? result.data.result : new Profile();
                  })
                  .catch(() => {
                      return new Profile();
                  });
    }

    public static async setMasterPin(newPin: string, oldPin?: string): Promise<boolean> {
        return Api.getApi().http
                  .patch('profile', Utils.removeNulls({pincode: oldPin, newPincode: newPin}))
                  .then((res: AxiosResponse<RestApiResponse<any>>) => {
                      return res && res.data && res.data.success;
                  });
    }

    public static createWallet(command: CreateWalletCommand): Promise<RestApiResponse<Wallet>> {
        return Api.getApi().http
                  .post('wallets', command)
                  .then((res: AxiosResponse<RestApiResponse<Wallet>>) => {
                          return res.data;
                      },
                  );
    }

    public static async linkWallet(command: LinkWalletCommand, override: boolean = false): Promise<ResponseBody> {
        return Api.getApi().http
                  .post(`wallets/link?override=${override}`, Utils.removeNulls(command))
                  .then((axiosRes: AxiosResponse) => {
                      return {
                          success: true,
                          result: {},
                      };
                  })
                  .catch((e: Error) => {
                      return {
                          success: false,
                          result: {},
                      };
                  });
    }

    public static importPrivateKey(command: ImportPrivateKeyCommand): Promise<Wallet> {
        return Api.getApi().http
                  .post(`wallets/import`, command)
                  .then((res: AxiosResponse<RestApiResponse<Wallet>>) => {
                      return Object.assign(new Wallet(), res.data.result);
                  });
    }

    public static importKeystore(command: ImportKeystoreCommand): Promise<Wallet> {
        return Api.getApi().http
                  .post(`wallets/import`, command)
                  .then((res: AxiosResponse<RestApiResponse<Wallet>>) => {
                      return Object.assign(new Wallet(), res.data.result);
                  });
    }

    public static async fetchIntercomVerification(): Promise<IntercomVerification> {
        const response: AxiosResponse<RestApiResponse<IntercomVerification>> = await Api.getApi().http.get('profile/intercom/verification');
        if (response.data && response.data.success) {
            return response.data.result;
        } else {
            return {
                hash: '',
            } as IntercomVerification;
        }
    }

    public static getTokenBalance(walletId: string, tokenAddress: string): Promise<RestApiResponse<TokenBalance>> {
        return Api.getApi().http
                  .get(`wallets/${walletId}/balance/tokens/${tokenAddress}`)
                  .then((result: AxiosResponse<RestApiResponse<TokenBalance>>) => {
                      return Object.assign({...result.data});
                  });
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

    private static handleTransaction(endpoint: string, data: any, pincode: string): Promise<ResponseBody> {
        return Api.getApi().http
                  .post(endpoint, Utils.removeNulls(Object.assign(data, {pincode})))
                  .then((axiosRes: AxiosResponse) => {
                      return axiosRes.data as ResponseBody;
                  })
                  .catch((error: AxiosResponse) => {
                      let response;
                      if (error.data) {
                          response = error.data;
                      } else {
                          response = 'unknown js error';
                      }
                      return {
                          success: false,
                          result: response,
                      };
                  });
    }

    private static prepareTransaction(endpoint: string, data: any): Promise<any> {
        return Api.getApi().http
                  .post(`${endpoint}/prepare`, Utils.removeNullsAndEmpty(data))
                  .then((res: AxiosResponse<RestApiResponse<any>>) => {
                          return res && res.data && res.data.result;
                      },
                  );
    }

    private api: RestApi;

    public constructor() {
        this.api = new RestApi(Utils.urls.api, () => Api.token);
    }
}
