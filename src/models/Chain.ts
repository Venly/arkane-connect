import {SecretType} from '@/models/SecretType';
import {ImportWalletType} from '@/models/ImportWalletType';

export class Chain {
    public name: string;
    public secretType: SecretType;
    public importWalletType: ImportWalletType;

    constructor(name: string, secretType: SecretType, importWalletType: ImportWalletType) {
        this.name = name;
        this.secretType = secretType;
        this.importWalletType = importWalletType;
    }
}

export interface Chains extends Array<Chain> {
    [id: number]: Chain;
}
