import { TransactionRequest } from '../TransactionRequest';

export class ImxErc721TransactionRequest extends TransactionRequest {
    public tokenId!: number;
    public tokenAddress!: string;
    public to!: string;
}
