export default class EthereumTransactionData {
    public type: string = 'ETHEREUM_TRANSACTION';
    public walletId: number = 0;
    public pincode: string = '';
    public submit: boolean = false;
    public gasPrice: number = 0;
    public gas: number = 0;
    public nonce: number = 0;
    public value: number = 0;
    public data: string = '0x';
    public to: string = '';
}
