import { TransactionRequest } from '../TransactionRequest';

export class HederaTokenAssociationTransactionRequest extends TransactionRequest {
    public allowanceType!: AllowanceType;
    public spenderAccount!: string;
    public amount?: number;
    public tokenId?: string;
    public serial?: string;
}

export enum AllowanceType {
    HBAR = 'HBAR',
    TOKEN = 'TOKEN',
    NFT = 'NFT',
    NFT_ALL = 'NFT_ALL',
}
