import { TransactionRequest } from '../TransactionRequest';

export class HbarTransferTransactionRequest extends TransactionRequest {
    public to!: string;
    public amount!: number;
    public transactionMemo?: string;
}
