import { SecretType }                  from '../SecretType';
import { Network }                     from '../Network';
import { BuildTransactionRequestType } from './BuildTransactionRequestType';
import { BuildTransactionRequestBase } from './BuildTransactionRequestBase';

export class BuildGasTransactionRequest extends BuildTransactionRequestBase implements BuildTransactionRequestBase {
    public value!: number;

    public static fromData(data: any) {
        const {walletId, to, value, secretType, alias, network} = data;
        return new this(walletId, to, value, secretType, alias, network);
    }

    constructor(walletId: string, to: string, value: number, secretType: SecretType, alias?: string, network?: Network) {
        super(BuildTransactionRequestType.GAS_TRANSFER, walletId, to, secretType, alias, network);
        this.value = value;
    }
}
