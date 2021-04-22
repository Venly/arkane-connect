import { BscBepTokenTransactionRequest } from './BscBepTokenTransactionRequest';

export class BscErc721TransactionRequest extends BscBepTokenTransactionRequest {
    public from!: string;
    public tokenId!: number;
    public amount?: number;
}
