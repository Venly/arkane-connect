import {SecretType} from '../SecretType';
import { Network }  from '../Network';

export class GenericTransactionRequest {
    public walletId!: string;
    public to!: string;
    public alias?: string;
    public value?: number;
    public secretType!: SecretType;
    public tokenAddress?: string;
    public data?: string;
    public from?: string;
    public tokenId?: bigint;
    public network?: Network;

    constructor(walletId: string, to: string, value: number, secretType: SecretType) {
        this.walletId = walletId;
        this.to = to;
        this.value = value;
        this.secretType = secretType;
    }
}
