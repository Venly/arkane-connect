export class HederaTokenTransferTransactionRequest {
    public from?: string;
    public to!: string;
    public tokenId!: string;
    public amount!: number;
}
