import { MaticErcTokenTransactionRequest } from './MaticErcTokenTransactionRequest';

export class MaticErc721TransactionRequest extends MaticErcTokenTransactionRequest {
    public from!: string;
    public tokenId!: number;
    public amount?: number;
}
