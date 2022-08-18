import { TransactionRequest } from '../TransactionRequest';

export class ImxErc20TransactionRequest extends TransactionRequest {
    public amount!: number;
    public tokenAddress!: string;
    public to!: string;
}
