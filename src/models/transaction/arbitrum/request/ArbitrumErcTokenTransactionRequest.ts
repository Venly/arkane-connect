import {TransactionRequest} from '../../TransactionRequest';

export class ArbitrumErcTokenTransactionRequest extends TransactionRequest {
    public gasPrice?: number;
    public gas?: number;
    public nonce?: number;
    public value!: number;
    public tokenAddress!: string;
    public to!: string;
}
