import axios, { AxiosError, AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import Utils                                                                                 from '../utils/Utils';
import { SecretType }                                                                        from '../models/SecretType';
import { Wallet, WalletType }                                                                from '../models/wallet/Wallet';
import { Profile }                                                                           from '../models/profile/Profile';
import { WalletBalance }                                                                     from '../models/wallet/WalletBalance';
import { TokenBalance }                                                                      from '../models/wallet/TokenBalance';
import { NFT }                                                                               from '../models/wallet/NFT';
import { TransactionRequest }                                                                from '..';
import { TxStatus }                                                                          from '../models/transaction/TxStatus';

export class Api {

    private http: AxiosInstance;

    constructor(baseURL: string,
                tokenProvider?: any) {
        this.http = axios.create({
            baseURL: baseURL.endsWith('/') ? baseURL.substring(0, baseURL.length - 1) : baseURL,
        });

        if (tokenProvider) {
            this.http.interceptors.request.use((config: AxiosRequestConfig): AxiosRequestConfig => {
                config.headers.common = {Authorization: 'Bearer ' + tokenProvider()};
                return config;
            });
        }
    }

    ////////////
    // Chains //
    ////////////
    public getAvailableSecretTypes = (): Promise<SecretType[]> => {
        return this.processResponse<SecretType[]>(this.http.get(`chains`));
    };

    ////////////
    // Wallet //
    ////////////
    public getWallets = (params?: { secretType?: SecretType, walletType?: WalletType, includeBalance?: boolean }): Promise<Wallet[]> => {
        params = (params && Utils.removeNulls(params)) || {};
        return this.processResponse<Wallet[]>(this.http.get('wallets', {params: params}));
    };

    public getWallet = (walletId: string): Promise<Wallet> => {
        return this.processResponse<Wallet>(this.http.get(`wallets/${walletId}`));
    };

    public getBalance = (walletId: string): Promise<WalletBalance> => {
        return this.processResponse<WalletBalance>(this.http.get(`wallets/${walletId}/balance`));
    };

    public getTokenBalances = (walletId: string): Promise<TokenBalance[]> => {
        return this.processResponse<TokenBalance[]>(this.http.get(`wallets/${walletId}/balance/tokens`));
    };

    public getTokenBalance = (walletId: string,
                              tokenAddress: string): Promise<TokenBalance> => {
        return this.processResponse<TokenBalance>(this.http.get(`wallets/${walletId}/balance/tokens/${tokenAddress}`));
    };

    public getNonfungibles = (walletId: string): Promise<NFT> => {
        return this.processResponse<NFT>(this.http.get(`wallets/${walletId}/nonfungibles`));
    };

    public getAllNonfungibles = (secretTypes: SecretType[]): Promise<NFT> => {
        const queryParams: string = secretTypes && secretTypes.length > 0
            ? "?" + secretTypes.map(st => "secretType=" + st).join("&")
            : "";
        return this.processResponse<NFT>(this.http.get(`wallets/nonfungibles${queryParams}`));
    };

    public unlink = (walletId: string): Promise<void> => {
        return this.processResponse<void>(this.http.delete(`wallets/${walletId}/link`));
    };

    /////////////
    // Profile //
    /////////////
    public getProfile = (): Promise<Profile> => {
        return this.processResponse<Profile>(this.http.get('profile'));
    };

    private processResponse<T>(axiosPromise: AxiosPromise<T>): Promise<T> {
        return new Promise<T>((resolve: any,
                               reject: any) => {
            axiosPromise.then((axiosRes: AxiosResponse) => {
                            if (axiosRes.data.success) {
                                if (axiosRes.data.result) {
                                    resolve(axiosRes.data.result);
                                } else {
                                    resolve();
                                }
                            } else {
                                reject(axiosRes.data.errors)
                            }
                        })
                        .catch((error: AxiosError) => {
                            if (error.response && error.response.data) {
                                reject(error.response.data.errors);
                            } else {
                                reject([{code: 'unknown.error', message: 'An unknown error occured'}]);
                            }
                        });
        });
    }

    //////////////////
    // Transactions //
    //////////////////
    public getPendingTransactions = (): Promise<TransactionRequest[]> => {
        return this.processResponse<TransactionRequest[]>(this.http.get('transactions'));
    };

    public deleteTransaction = (transactionId: string): Promise<any> => {
        return this.processResponse<any>(this.http.delete(`transactions/${transactionId}`));
    };

    public getTransactionStatus = (transactionHash: string,
                                   secretType: SecretType): Promise<RestApiResponseTxStatus> => {
        return this.processResponse<RestApiResponseTxStatus>(this.http.get(`transactions/${secretType}/${transactionHash}/status`));
    };
}

export interface RestApiResponseTxStatus {
    status: TxStatus;
}

export interface RestApiResponseError {
    code: string;
    message: string;
}

export interface RestApiResponse<T> {
    success: boolean;
    errors: RestApiResponseError[];
    result: T;
}
