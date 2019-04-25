import { TransactionRequest }        from './transaction/TransactionRequest';
import { GenericTransactionRequest } from './transaction/GenericTransactionRequest';
import { GenericSignatureRequest }   from './transaction/GenericSignatureRequest';
import { ConfirmationRequest }       from './ConfirmationRequest';

export type RequestDataType = TransactionRequest | GenericTransactionRequest | GenericSignatureRequest | { transactionId: string } | ConfirmationRequest;
