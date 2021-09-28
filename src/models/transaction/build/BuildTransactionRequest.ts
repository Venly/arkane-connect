import { SecretType }                     from '../../SecretType';
import { Network }                        from '../../Network';
import { BuildTransactionRequestType }    from './BuildTransactionRequestType';
import { BuildTransferRequestBase }       from './BuildTransferRequestBase';
import { BuildGenericTransferRequestDto } from './BuildGenericTransferRequestDto';

export class BuildTransactionRequest extends BuildTransferRequestBase implements BuildGenericTransferRequestDto {
    public value?: number;
    public tokenAddress?: string;
    public data?: string;
    public from?: string;
    public tokenId?: string;

    public static fromData(requestData: BuildGenericTransferRequestDto): BuildTransactionRequest {
        const {walletId, to, secretType, value, tokenAddress, data, from, tokenId, network} = requestData;
        return new this(walletId, to, secretType, value, tokenAddress, data, from, tokenId, network);
    }

    constructor(
        walletId: string,
        to: string,
        secretType: SecretType,
        value?: number,
        tokenAddress?: string,
        data?: string,
        from?: string,
        tokenId?: string,
        network?: Network
    ) {
        let type;
        if (tokenAddress && tokenId) {
            type = BuildTransactionRequestType.NFT_TRANSFER;
        } else if (tokenAddress) {
            type = BuildTransactionRequestType.TOKEN_TRANSFER;
        } else {
            type = BuildTransactionRequestType.TRANSFER;
        }
        super(type, walletId, to, secretType, network);

        this.value = value;
        tokenAddress ? this.tokenAddress = tokenAddress : undefined;
        data ? this.data = data : undefined;
        from ? this.from = from : undefined;
        tokenId ? this.tokenId = tokenId : undefined;
    }
}
