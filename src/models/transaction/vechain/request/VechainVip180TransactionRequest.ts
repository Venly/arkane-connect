import {TransactionRequest} from '../../TransactionRequest';

export interface VechainVip180TransactionClause {
    to: string;
    amount: string;
    tokenAddress: string;
}

export class VechainVip180TransactionRequest extends TransactionRequest {
    public blockRef?: string;
    public chainTag?: string;
    public expiration: number = 0;
    public gas!: number;
    public gasPriceCoef!: string;
    public nonce?: string;
    public clauses: VechainVip180TransactionClause[] = [];
}
