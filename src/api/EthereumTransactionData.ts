export default class EthereumTransactionData {
    public type!: string;
    public walletId!: number;
    public pincode!: string;
    public submit: boolean = false;
    public gasPrice?: number = 0;
    public gas?: number = 0;
    public nonce?: number;
    public value!: number;
    public data: string = '0x';
    public to!: string;
}
