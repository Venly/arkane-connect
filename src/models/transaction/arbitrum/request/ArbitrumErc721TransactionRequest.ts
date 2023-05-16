import { ArbitrumErcTokenTransactionRequest } from './ArbitrumErcTokenTransactionRequest';

export class ArbitrumErc721TransactionRequest extends ArbitrumErcTokenTransactionRequest {
    public from!: string;
    public tokenId!: number;
    public amount?: number;
}
