import { SecretType }                       from '../../SecretType';
import { Network }                          from '../../Network';
import { BuildTransactionRequestType }      from './BuildTransactionRequestType';
import { BuildTransactionRequestBase }      from './BuildTransactionRequestBase';
import { BuildSimpleTransactionRequestDto } from './BuildSimpleTransactionRequestDto';

export class BuildSimpleTransactionRequest extends BuildTransactionRequestBase implements BuildSimpleTransactionRequestDto {

    public static fromData(requestData: BuildSimpleTransactionRequestDto): BuildSimpleTransactionRequest {
        const {walletId, to, secretType, value, alias, data, network} = requestData;
        return new this(walletId, to, secretType, value, alias, data, network);
    }

    public value?: number;
    public data?: string;

    constructor(walletId: string, to: string, secretType: SecretType, value?: number, alias?: string, data?: string, network?: Network) {
        super(BuildTransactionRequestType.TRANSFER, walletId, to, secretType, alias, network);
        this.value = value;
        data ? this.data = data : undefined;
    }
}
