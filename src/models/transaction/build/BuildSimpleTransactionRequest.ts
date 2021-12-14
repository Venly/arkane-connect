import { SecretType }                  from '../../SecretType';
import { Network }                     from '../../Network';
import { BuildTransactionRequestType } from './BuildTransactionRequestType';
import { BuildTransferRequestBase }    from './BuildTransferRequestBase';
import { BuildTransferRequestDto }     from './BuildTransferRequestDto';

export class BuildSimpleTransactionRequest extends BuildTransferRequestBase implements BuildTransferRequestDto {

    public static fromData(requestData: BuildTransferRequestDto): BuildSimpleTransactionRequest {
        const {walletId, to, secretType, value, data, network, chainSpecificFields} = requestData;
        return new this(walletId, to, secretType, value, data, network, chainSpecificFields);
    }

    public value?: number;
    public data?: string;

    constructor(walletId: string, to: string, secretType: SecretType, value?: number, data?: string, network?: Network, chainSpecificFields?:string) {
        super(BuildTransactionRequestType.TRANSFER, walletId, to, secretType, network, chainSpecificFields);
        this.value = value;
        data ? this.data = data : undefined;
    }
}
