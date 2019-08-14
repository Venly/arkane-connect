import { TransactionRequest } from '../../TransactionRequest';

export class NeoGasTransactionRequest extends TransactionRequest {
    public value!: number;
    public to!: string;
}
