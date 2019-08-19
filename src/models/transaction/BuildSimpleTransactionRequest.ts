import { SecretType }                  from '../SecretType';
import { Network }                     from '../Network';
import { BuildTransactionRequestType } from './BuildTransactionRequestType';
import { BuildTransactionRequestBase } from './BuildTransactionRequestBase';

export class BuildSimpleTransactionRequest extends BuildTransactionRequestBase implements BuildTransactionRequestBase {

    public static fromData(requestData: any): BuildSimpleTransactionRequest {
        const {walletId, to, alias, value, secretType, data, network} = requestData;
        return new this(walletId, to, value, secretType, alias, data, network);
    }

    public value?: number;
    public data?: string;

    constructor(walletId: string, to: string, value: number, secretType: SecretType, alias?: string, data?: string, network?: Network) {
        super(BuildTransactionRequestType.TRANSFER, walletId, to, secretType, alias, network);
        this.value = value;
        data ? this.data = data : undefined;
    }
}
