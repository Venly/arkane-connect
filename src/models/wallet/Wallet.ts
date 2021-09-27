import {SecretType}    from '../SecretType';
import {WalletBalance} from './WalletBalance';
import DateTimeFormat = Intl.DateTimeFormat;

export enum WalletType {
    THREEWAY_SHARED = 'THREEWAY_SHARED',
    USER_OWNED = 'USER_OWNED',
    UNCLAIMED = 'UNCLAIMED',
    APPLICATION = 'APPLICATION',
}

export enum WalletAppType {
    APP = 'APP',
    PERSONAL = 'PERSONAL',
}

export class Wallet {
    public id!: string;
    public address!: string;
    public walletType?: WalletType;
    public secretType!: SecretType;
    public archived!: boolean;
    public description?: string = '';
    public primary?: boolean;
    public balance?: WalletBalance;
    public hasCustomPin?: false;
    public status!: string;
    public createdAt?: Date;
    public lastUpdated?: number = 0;
}

export interface Wallets extends Array<Wallet> {
    [id: number]: Wallet;
}
