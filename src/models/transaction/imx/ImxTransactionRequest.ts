import { TransactionRequest } from '../TransactionRequest';

export class ImxTransactionRequest extends TransactionRequest {
    public to!: string;
    public amount!: number;
}
