import {TransactionRequest} from '../../TransactionRequest';

export interface VechainTransactionRequestClause {
    to: string;
    data: string;
    amount: number;
}

export default class VechainTransactionRequest extends TransactionRequest {
    public pincode!: string;
    public submit: boolean = false;
    public blockRef?: string;
    public chainTag?: string;
    public expiration: number = 0;
    public gas!: number;
    public gasPriceCoef!: number;
    public nonce?: string;
    public clauses: VechainTransactionRequestClause[] = [];
}
