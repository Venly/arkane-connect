import axios, { AxiosError, AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import Utils                                                                                 from '../utils/Utils';
import { SecretType }                                                                        from '../models/SecretType';
import { Wallet, WalletType }                                                                from '../models/wallet/Wallet';
import { Profile }                                                                           from '../models/profile/Profile';
import { WalletBalance }                                                                     from '../models/wallet/WalletBalance';
import { TokenBalance }                                                                      from '../models/wallet/TokenBalance';
import { NFT, WalletItems }                                                                  from '../models/wallet/NFT';
import { TransactionRequest }                                                                from '..';
import { TxStatus }                                                                          from '../models/transaction/TxStatus';
import { ContractReadRequest }                                                               from '../models/contract/ContractReadRequest';
import { ContractReadResult }                                                                from '../models/contract/ContractReadResult';

export class Api {

    private http: AxiosInstance;

    constructor(baseURL: string,
                tokenProvider?: any) {
        this.http = axios.create({
            baseURL: baseURL.endsWith('/') ? baseURL.substring(0, baseURL.length - 1) : baseURL,
        });

        if (tokenProvider) {
            this.http.interceptors.request.use((config: AxiosRequestConfig): AxiosRequestConfig => {
                let bearerToken = tokenProvider();
                if (!bearerToken) {
                    throw new Error('Not authenticated')
                }
                config.headers.common = {Authorization: 'Bearer ' + bearerToken};
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

    public getBalanceByAddress = (secretType: SecretType, walletAddress: string): Promise<WalletBalance> => {
        return this.processResponse<WalletBalance>(this.http.get(`wallets/${secretType}/${walletAddress}/balance`));
    };

    public getTokenBalances = (walletId: string): Promise<TokenBalance[]> => {
        return this.processResponse<TokenBalance[]>(this.http.get(`wallets/${walletId}/balance/tokens`));
    };

    public getTokenBalancesByAddress = (secretType: SecretType, walletAddress: string): Promise<TokenBalance[]> => {
        return this.processResponse<TokenBalance[]>(this.http.get(`wallets/${secretType}/${walletAddress}/balance/tokens`));
    };

    public getTokenBalance = (walletId: string,
                              tokenAddress: string): Promise<TokenBalance> => {
        return this.processResponse<TokenBalance>(this.http.get(`wallets/${walletId}/balance/tokens/${tokenAddress}`));
    };

    public getTokenBalanceByAddress = (secretType: SecretType, walletAddress: string,
                              tokenAddress: string): Promise<TokenBalance> => {
        return this.processResponse<TokenBalance>(this.http.get(`wallets/${secretType}/${walletAddress}/balance/tokens/${tokenAddress}`));
    };

    public getNonfungibles = (walletId: string): Promise<NFT[]> => {
        return this.processResponse<NFT[]>(this.http.get(`wallets/${walletId}/nonfungibles`));
    };

    public getNonfungiblesByAddress = (secretType: SecretType, walletAddress: string): Promise<NFT[]> => {
        return this.processResponse<NFT[]>(this.http.get(`wallets/${secretType}/${walletAddress}/nonfungibles`));
    };

    public getAllNonfungibles = (secretTypes?: SecretType[]): Promise<WalletItems[]> => {
        const queryParams: string = secretTypes && secretTypes.length > 0
            ? "?" + secretTypes.map(st => "secretType=" + st).join("&")
            : "";
        return this.processResponse<WalletItems[]>(this.http.get(`wallets/nonfungibles${queryParams}`));
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
                            } else if (error.message) {
                                let code = error.message.indexOf('authenticat') >= 0 ? 'auth.error' : 'unknown.error';
                                reject([{code: code, message: error.message}]);
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

    ///////////////
    // Contracts //
    ///////////////
    public readContract = (contractReadRequest: ContractReadRequest): Promise<ContractReadResult> => {
        return this.processResponse<ContractReadResult>(this.http.post('contracts/read', contractReadRequest));
    };
}

export interface RestApiResponseTxStatus {
    hash: string;
    status: TxStatus;
    confirmations: number;
    blockHash: string;
    blockNumber: number;
    hasReachedFinality: boolean;
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
