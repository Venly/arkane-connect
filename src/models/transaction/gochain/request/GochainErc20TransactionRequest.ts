import {TransactionRequest} from '../../TransactionRequest';

export class GochainErc20TransactionRequest extends TransactionRequest {
    public pincode!: string;
    public gasPrice?: number;
    public gas?: number;
    public nonce?: number;
    public value!: number;
    public tokenAddress!: string;
    public to!: string;
}
