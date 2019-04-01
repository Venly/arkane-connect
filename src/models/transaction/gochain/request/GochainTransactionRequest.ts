import {TransactionRequest} from '../../TransactionRequest';

export class GochainTransactionRequest extends TransactionRequest {
    public gasPrice?: number;
    public gas?: number;
    public nonce?: number;
    public value!: number;
    public data: string = '0x';
    public to!: string;
}
