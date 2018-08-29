export interface VechainTransactionDataClause {
    to: string;
    data: string;
    amount: string;
}

export default class VechainTransactionData {
    public type: string = 'VECHAIN_TRANSACTION';
    public walletId: number = 0;
    public pincode: string = '';
    public submit: boolean = false;
    public blockRef: string = '';
    public chainTag: string = '';
    public expiration: number = 0;
    public gas: number = 0;
    public gasPriceCoef: string = '';
    public nonce: string = '';
    public clauses: VechainTransactionDataClause[] = [{
        to: '',
        data: '0x0',
        amount: '',
    }];
}
