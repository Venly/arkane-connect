import { SecretType }                   from '../../SecretType';
import { Network }                      from '../../Network';
import { BuildTransactionRequestType }  from './BuildTransactionRequestType';
import { BuildTransferRequestBase }     from './BuildTransferRequestBase';
import { BuildTokenTransferRequestDto } from './BuildTokenTransferRequestDto';

export class BuildTokenTransferRequest extends BuildTransferRequestBase implements BuildTokenTransferRequestDto {

    public value!: number;
    public tokenAddress!: string;

    public static fromData(requestData: BuildTokenTransferRequestDto): BuildTokenTransferRequest {
        const {walletId, to, value, secretType, tokenAddress, network, chainSpecificFields} = requestData;
        return new this(walletId, to, value, secretType, tokenAddress, network, chainSpecificFields);
    }

    constructor(
        walletId: string,
        to: string,
        value: number,
        secretType: SecretType,
        tokenAddress: string,
        network?: Network,
        chainSpecificFields?: string
    ) {
        super(BuildTransactionRequestType.TOKEN_TRANSFER, walletId, to, secretType, network, chainSpecificFields);

        this.value = value;
        this.tokenAddress = tokenAddress;
    }
}
