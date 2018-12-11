import axios, { AxiosError, AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import Utils                                                                                 from '../utils/Utils';
import { SecretType }                                                                        from '../models/SecretType';
import { Wallet }                                                                            from '../models/wallet/Wallet';
import { Profile }                                                                           from '../models/profile/Profile';
import { GenericTransactionRequest }                                                         from '../models/transaction/GenericTransactionRequest';
import { TransactionRequest }                                                                from '../models/transaction/TransactionRequest';
import { WalletBalance }                                                                     from '../models/wallet/WalletBalance';
import TokenBalance                                                                          from '../models/wallet/TokenBalance';
import { TransactionResult }                                                                 from '../models/transaction/TransactionResult';

export default class Api {

    private http: AxiosInstance;

    constructor(baseURL: string, tokenProvider?: any) {
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
    // Wallet //
    ////////////
    public getWallets = (filter?: { secretType?: SecretType }): Promise<Wallet[]> => {
        filter = (filter && Utils.removeNulls(filter)) || {};
        return this.processResponse<Wallet[]>(this.http.get('wallets', {params: filter}));
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

    public getTokenBalance = (walletId: string, tokenAddress: string): Promise<TokenBalance> => {
        return this.processResponse<TokenBalance>(this.http.get(`wallets/${walletId}/balance/tokens/${tokenAddress}`));
    };


    /////////////////
    // Transaction //
    /////////////////
    public signTransaction = (transactionRequest: TransactionRequest): Promise<TransactionResult> => {
        return this.processResponse<TransactionResult>(this.http.post('signatures', transactionRequest));
    };

    public prepareSignature = (transactionRequest: TransactionRequest): Promise<any> => {
        return this.processResponse<any>(this.http.post('signatures/prepare', transactionRequest));
    };

    public executeTransaction = (transactionRequest: TransactionRequest): Promise<TransactionResult> => {
        return this.processResponse<TransactionResult>(this.http.post('transactions', transactionRequest));
    };

    public buildTransactionRequest = (genericTransactionRequest: GenericTransactionRequest): Promise<TransactionRequest> => {
        return this.processResponse<TransactionRequest>(this.http.post('transactions/build', genericTransactionRequest))
    };

    public prepareTransaction = (transactionRequest: TransactionRequest): Promise<any> => {
        return this.processResponse<any>(this.http.post('transactions/prepare', transactionRequest));
    };


    /////////////
    // Profile //
    /////////////
    public getProfile = (): Promise<Profile> => {
        return this.processResponse<Profile>(this.http.get('profile'));
    };

    private processResponse<T>(axiosPromise: AxiosPromise<T>): Promise<T> {
        return new Promise<T>((resolve: any, reject: any) => {
            axiosPromise.then((axiosRes: AxiosResponse) => {
                            if (axiosRes.data.success) {
                                resolve(axiosRes.data.result);
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
