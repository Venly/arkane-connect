import { TransactionRequest } from '../TransactionRequest';

export class EthTransferTransactionRequest extends TransactionRequest {
    public to!: string;
    public amount!: number;
}
