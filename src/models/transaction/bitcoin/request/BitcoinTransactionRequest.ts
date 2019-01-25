import { TransactionRequest } from '../../TransactionRequest';

export default class BitcoinTransactionRequest extends TransactionRequest {
    public pincode!: string;
    public value!: number;
    public to!: string;
    public feePerByte?: number;
}
