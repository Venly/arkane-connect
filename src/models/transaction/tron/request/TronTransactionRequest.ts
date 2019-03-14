import {TransactionRequest} from '../../TransactionRequest';

export class TronTransactionRequest extends TransactionRequest {
    public pincode!: string;
    public value!: number;
    public to!: string;
}
