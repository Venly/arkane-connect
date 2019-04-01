import { GenericTransactionRequest }       from '../models/transaction/GenericTransactionRequest';
import { PopupSigner }                     from './PopupSigner';
import { RedirectOptions, RedirectSigner } from './RedirectSigner';
import { GenericSignatureRequest }         from '../models/transaction/GenericSignatureRequest';



export interface Signer {
    executeTransaction: (transactionRequest: GenericTransactionRequest, RedirectOptions?: RedirectOptions) => Promise<SignerResult>;
    executeNativeTransaction: (transactionRequest: any, RedirectOptions?: RedirectOptions) => Promise<SignerResult>;
    sign: (signatureRequest: GenericSignatureRequest, redirectOptions?: RedirectOptions) => Promise<SignerResult>;
    /** Deprecated since 1.1.9. Use sign instead */
    signTransaction: (signatureRequest: GenericSignatureRequest, redirectOptions?: RedirectOptions) => Promise<SignerResult>;
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
