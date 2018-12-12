import {TransactionRequest} from '../../TransactionRequest';

export class EthereumErc20TransactionRequest extends TransactionRequest {
    public pincode!: string;
    public submit: boolean = false;
    public gasPrice?: number;
    public gas?: number;
    public nonce?: number;
    public value!: number;
    public tokenAddress!: string;
    public to!: string;
}
