import { SecretType }                   from '../../SecretType';
import { Network }                      from '../../Network';
import { BuildTransactionRequestType }  from './BuildTransactionRequestType';
import { BuildTransferRequestBase }     from './BuildTransferRequestBase';
import { BuildTokenTransferRequestDto } from './BuildTokenTransferRequestDto';

export class BuildTokenTransferRequest extends BuildTransferRequestBase implements BuildTokenTransferRequestDto {

    public value!: number;
    public tokenAddress!: string;

    public static fromData(requestData: BuildTokenTransferRequestDto): BuildTokenTransferRequest {
        const {walletId, to, alias, value, secretType, tokenAddress, network} = requestData;
        return new this(walletId, to, value, secretType, tokenAddress, alias, network);
    }

    constructor(
        walletId: string,
        to: string,
        value: number,
        secretType: SecretType,
        tokenAddress: string,
        alias?: string,
        network?: Network
    ) {
        super(BuildTransactionRequestType.TOKEN_TRANSFER, walletId, to, secretType, alias, network);

        this.value = value;
        this.tokenAddress = tokenAddress;
    }
}
