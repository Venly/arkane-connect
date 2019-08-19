import { SecretType }                  from '../SecretType';
import { Network }                     from '../Network';
import { BuildTransactionRequestType } from './BuildTransactionRequestType';
import { BuildTransactionRequestBase } from './BuildTransactionRequestBase';

export class BuildTransactionRequest extends BuildTransactionRequestBase {
    public value?: number;
    public tokenAddress?: string;
    public data?: string;
    public from?: string;
    public tokenId?: string;

    public static fromData(requestData: any): BuildTransactionRequest {
        const {walletId, to, alias, value, secretType, tokenAddress, data, from, tokenId, network} = requestData;
        return new this(walletId, to, value, secretType, alias, tokenAddress, data, from, tokenId, network);
    }

    constructor(
        walletId: string,
        to: string,
        value: number,
        secretType: SecretType,
        alias?: string,
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
        super(type, walletId, to, secretType, alias, network);

        this.value = value;
        tokenAddress ? this.tokenAddress = tokenAddress : undefined;
        data ? this.data = data : undefined;
        from ? this.from = from : undefined;
        tokenId ? this.tokenId = tokenId : undefined;
    }
}
