import { EthereumErcTokenTransactionRequest } from './EthereumErcTokenTransactionRequest';

export class EthereumErc721TransactionRequest extends EthereumErcTokenTransactionRequest {
    public from!: string;
    public tokenId!: number;
    public amount?: number;
}
