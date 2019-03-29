import { GenericTransactionRequest } from '../models/transaction/GenericTransactionRequest';
import { PopupSigner }               from './PopupSigner';
import { RedirectSigner }            from './RedirectSigner';


export interface Signer {
    executeTransaction: (transactionRequest: GenericTransactionRequest, options?: any) => Promise<SignerResult>;
    executeNativeTransaction: (transactionRequest: any, options?: any) => Promise<SignerResult>;
    signTransaction: (transactionRequest: any, options?: any) => Promise<SignerResult>;
}

export class SignerFactory {

    public static createSignerFor(signMethod: SignMethod, bearerTokenProvider: () => string): Signer {
        switch (signMethod) {
            case SignMethod.POPUP:
                return new PopupSigner(bearerTokenProvider);
            case SignMethod.REDIRECT:
                return new RedirectSigner(bearerTokenProvider);
            default:
                throw new Error('The provided signMethod is not supported');
        }
    }
}

export enum SignMethod {
    POPUP = 'POPUP',
    REDIRECT = 'REDIRECT',
}


export interface SignerResult {
    status: 'SUCCESS' | 'ABORTED',
    result?: any,
    errors?: any[]
}
