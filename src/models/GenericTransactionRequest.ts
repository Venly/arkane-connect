import {SecretType} from './SecretType';

export class GenericTransactionRequest {
    public walletId!: string;
    public to!: string;
    public alias?: string;
    public value!: number;
    public secretType!: SecretType;
    public tokenAddress?: string;
    public comments?: string;

    constructor(walletId: string, to: string, value: number, secretType: SecretType) {
        this.walletId = walletId;
        this.to = to;
        this.value = value;
        this.secretType = secretType;
    }
}
