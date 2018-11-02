export default class EthereumErc20TransactionRequest {
    public type!: string;
    public walletId!: string;
    public pincode!: string;
    public submit: boolean = false;
    public gasPrice?: number;
    public gas?: number;
    public nonce?: number;
    public value!: number;
    public tokenAddress!: string;
    public to!: string;
}
