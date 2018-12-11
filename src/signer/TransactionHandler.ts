import { GenericTransactionRequest }  from '../models/transaction/GenericTransactionRequest';
import ResponseBody                   from '../api/ResponseBody';
import { SignMethod }                 from './index';
import { PopupTransactionHandler }    from './PopupTransactionHandler';
import { RedirectTransactionHandler } from './RedirectTransactionHandler';

export interface TransactionHandler {
    executeTransaction: (transactionRequest: GenericTransactionRequest, options?: any) => Promise<ResponseBody>;
    executeNativeTransaction: (transactionRequest: any, options?: any) => Promise<ResponseBody>;
    signTransaction: (transactionRequest: any, options?: any) => Promise<ResponseBody>;
}

export class TransactionHandlerResolver {

    public static createTransactionHandlerFor(signMethod: SignMethod, bearerTokenProvider: () => string): TransactionHandler {
        switch (signMethod) {
            case SignMethod.POPUP:
                return new PopupTransactionHandler(bearerTokenProvider);
            case SignMethod.REDIRECT:
                return new RedirectTransactionHandler(bearerTokenProvider);
            default:
                throw new Error('The provided signMethod is not supported');
        }
    }
}
