import { GenericTransactionRequest } from '../models/transaction/GenericTransactionRequest';
import { SignerResult, SignMethod }  from './index';
import { PopupSignerHandler }        from './PopupSignerHandler';
import { RedirectSignerHandler }     from './RedirectSignerHandler';

export interface SignerHandler {
    executeTransaction: (transactionRequest: GenericTransactionRequest, options?: any) => Promise<SignerResult>;
    executeNativeTransaction: (transactionRequest: any, options?: any) => Promise<SignerResult>;
    signTransaction: (transactionRequest: any, options?: any) => Promise<SignerResult>;
}

export class SignerHandlerResolver {

    public static createSignerHandlerFor(signMethod: SignMethod, bearerTokenProvider: () => string): SignerHandler {
        switch (signMethod) {
            case SignMethod.POPUP:
                return new PopupSignerHandler(bearerTokenProvider);
            case SignMethod.REDIRECT:
                return new RedirectSignerHandler(bearerTokenProvider);
            default:
                throw new Error('The provided signMethod is not supported');
        }
    }
}