export default class EthereumTransactionData {
    public type!: string;
    public walletId!: string;
    public pincode!: string;
    public submit: boolean = false;
    public gasPrice?: number;
    public gas?: number;
    public nonce?: number;
    public value!: number;
    public data: string = '0x';
    public to!: string;
}
