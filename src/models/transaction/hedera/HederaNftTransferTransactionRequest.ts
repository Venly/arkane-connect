import { TransactionRequest } from '../TransactionRequest';

export class HederaNftTransferTransactionRequest extends TransactionRequest {
    public to!: string;
    public nftId!: string;
    public transactionMemo?: string;
}
