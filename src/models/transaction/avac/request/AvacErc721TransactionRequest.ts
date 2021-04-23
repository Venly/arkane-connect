import { AvacErcTokenTransactionRequest } from './AvacErcTokenTransactionRequest';

export class AvacErc721TransactionRequest extends AvacErcTokenTransactionRequest {
    public from!: string;
    public tokenId!: number;
    public amount?: number;
}
