import {Fund} from './Fund';

export enum SecretType {
    ETHEREUM = 'ETHEREUM',
}
export enum WalletType {
    THREEWAY_SHARED = 'THREEWAY_SHARED',
}

export enum WalletAppType {
    APP = 'APP',
    PERSONAL = 'PERSONAL',
}

export enum WalletIntegratedApp {
    FUNDREQUEST = 'FND',
    DOCK = 'DOCK',
    SAVE_HEAVEN = 'SHA',
    NONE = 'NONE',
}

export class Wallet {
    public id = 0;
    public address = '';
    public walletType?: WalletType;
    public secretType?: SecretType;
    public name = '';
    public type = WalletAppType.PERSONAL;
    public funds: Fund[] = [];
    public app ? = WalletIntegratedApp.FUNDREQUEST;
    public lastUpdated ? = 0;

    public createdAt?: string;
    public alias = '';
    public description = '';
    public archived = false;
    public primary = false;
}

export interface Wallets extends Array<Wallet> {
    [id: number]: Wallet;
}
