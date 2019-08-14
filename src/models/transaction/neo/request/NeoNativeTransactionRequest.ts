import { TransactionRequest } from '../../TransactionRequest';

export class NeoNativeTransactionRequest extends TransactionRequest {
    public value!: number;
    public to!: string;
}
