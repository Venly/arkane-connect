import { TransactionRequest }          from './transaction/TransactionRequest';
import { BuildTransactionRequestBase } from './transaction/BuildTransactionRequestBase';
import { GenericSignatureRequest }     from './transaction/GenericSignatureRequest';
import { ConfirmationRequest }         from './ConfirmationRequest';

export type RequestDataType = TransactionRequest | BuildTransactionRequestBase | GenericSignatureRequest | { transactionId: string } | ConfirmationRequest;
