import { SecretType }                  from '../../SecretType';
import { Network }                     from '../../Network';
import { BuildTransactionRequestType } from './BuildTransactionRequestType';
import { BuildTransferRequestBase }    from './BuildTransferRequestBase';
import { BuildNftTransferRequestDto }  from './BuildNftTransferRequestDto';

export class BuildNftTransferRequest extends BuildTransferRequestBase implements BuildNftTransferRequestDto {
    public tokenAddress!: string;
    public tokenId!: string;
    public from?: string;
    public amount?: number;

    public static fromData(requestData: BuildNftTransferRequestDto): BuildNftTransferRequest {
        const {walletId, to, secretType, tokenAddress, tokenId, amount, from, network, chainSpecificFields} = requestData;
        return new this(walletId, to, secretType, tokenAddress, tokenId, amount, from, network, chainSpecificFields);
    }

    constructor(walletId: string, to: string, secretType: SecretType, tokenAddress: string, tokenId: string, amount?: number, from?: string, network?: Network, chainSpecificFields?: string) {
        super(BuildTransactionRequestType.NFT_TRANSFER, walletId, to, secretType, network);
        this.tokenAddress = tokenAddress;
        this.tokenId = tokenId;
        this.amount = amount ? amount : 1;
        from ? this.from = from : undefined;
        chainSpecificFields? this.chainSpecificFields = chainSpecificFields : undefined;
    }
}
