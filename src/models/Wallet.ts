import {Fund} from './Fund';
import {SecretType} from './SecretType';
import {Balance} from './Balance';

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
    public id: string = '0';
    public address: string = '';
    public walletType?: WalletType;
    public secretType?: SecretType;
    public type: WalletAppType = WalletAppType.PERSONAL;
    public funds: Fund[] = [];
    public app?: WalletIntegratedApp = WalletIntegratedApp.FUNDREQUEST;
    public lastUpdated ? = 0;

    public createdAt?: string;
    public alias: string = '';
    public description: string = '';
    public archived: boolean = false;
    public primary: boolean = false;
    public balance?: Balance;
}

export interface Wallets extends Array<Wallet> {
    [id: number]: Wallet;
}
