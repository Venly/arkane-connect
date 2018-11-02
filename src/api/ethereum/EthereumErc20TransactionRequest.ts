export default class EthereumErc20TransactionRequest {
    public type!: string;
    public walletId!: number;
    public pincode!: string;
    public submit: boolean = false;
    public gasPrice?: number;
    public gas?: number;
    public nonce?: number;
    public value!: number;
    public data: string = '0x';
    public tokenAddress!: string;
    public to!: string;
}
