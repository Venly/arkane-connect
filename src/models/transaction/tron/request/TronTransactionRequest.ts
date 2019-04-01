import { TransactionRequest } from '../../TransactionRequest';

export class TronTransactionRequest extends TransactionRequest {
    public value!: number;
    public data!: string;
    public to!: string;
}
