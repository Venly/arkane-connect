import { TransactionRequest } from '../TransactionRequest';

export class HederaTokenTransferTransactionRequest extends TransactionRequest {
    public to!: string;
    public tokenId!: string;
    public amount!: number;
    public transactionMemo?: string;
}
