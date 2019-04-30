import { PopupSigner }                     from './PopupSigner';
import { RedirectOptions, RedirectSigner } from './RedirectSigner';
import { ConfirmationRequest }             from '../models/ConfirmationRequest';
import { GenericSignatureRequest }         from '../models/transaction/GenericSignatureRequest';
import { GenericTransactionRequest }       from '../models/transaction/GenericTransactionRequest';
import { WindowMode }                      from '../models/WindowMode';
import { PopupResult }                     from '../popup/PopupResult';


export interface Signer {
    executeTransaction: (genericTransactionRequestOrTransactionId: GenericTransactionRequest | string, RedirectOptions?: RedirectOptions) => Promise<SignerResult>;
    executeNativeTransaction: (transactionRequest: any, RedirectOptions?: RedirectOptions) => Promise<SignerResult>;
    sign: (signatureRequest: GenericSignatureRequest, redirectOptions?: RedirectOptions) => Promise<SignerResult>;
    /** Deprecated since 1.1.9. Use sign instead */
    signTransaction: (signatureRequest: GenericSignatureRequest, redirectOptions?: RedirectOptions) => Promise<SignerResult>;
    confirm: (request: ConfirmationRequest, redirectOptions?: RedirectOptions) => Promise<SignerResult>;
}

export class SignerFactory {

    public static createSignerFor(signMethod: WindowMode, bearerTokenProvider: () => string): Signer {
        switch (signMethod) {
            case WindowMode.POPUP:
                return new PopupSigner(bearerTokenProvider);
            case WindowMode.REDIRECT:
                return new RedirectSigner(bearerTokenProvider);
            default:
                throw new Error('The provided signMethod is not supported');
        }
    }
}

/* Deprecated, use WindowMode */
export enum SignMethod {
    POPUP = 'POPUP',
    REDIRECT = 'REDIRECT',
}

export interface SignerResult extends PopupResult {
}
