import { TransactionRequest } from '../models/transaction/TransactionRequest';

export interface SignerTransactionData {
    action: string;
    transactionRequest: TransactionRequest;
    bearerToken: string;
}