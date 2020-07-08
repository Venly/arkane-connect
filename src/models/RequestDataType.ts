import { TransactionRequest }        from './transaction/TransactionRequest';
import { BuildTransferRequestBase }  from './transaction/build/BuildTransferRequestBase';
import { GenericSignatureRequest }   from './transaction/GenericSignatureRequest';
import { ConfirmationRequest }       from './ConfirmationRequest';
import { BuildSignatureRequestType } from './transaction/build/BuildSignatureRequestType';

export type RequestDataType = TransactionRequest | BuildTransferRequestBase | BuildSignatureRequestType | GenericSignatureRequest | ConfirmationRequest | {};
