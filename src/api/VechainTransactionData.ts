export interface VechainTransactionDataClause {
    to: string;
    data: string;
    amount: string;
}

export default class VechainTransactionData {
    public type!: string;
    public walletId!: string;
    public pincode!: string;
    public submit: boolean = false;
    public blockRef?: string;
    public chainTag?: string;
    public expiration: number = 0;
    public gas!: number;
    public gasPriceCoef!: string;
    public nonce?: string;
    public clauses: VechainTransactionDataClause[] = [];
}
