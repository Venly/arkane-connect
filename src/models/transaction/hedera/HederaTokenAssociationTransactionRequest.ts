import { TransactionRequest } from '../TransactionRequest';

export class HederaTokenAssociationTransactionRequest extends TransactionRequest {
    public tokenIds!: string[];
}
