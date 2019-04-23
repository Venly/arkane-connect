import { GenericTransactionRequest }       from '../models/transaction/GenericTransactionRequest';
import { PopupSigner }                     from './PopupSigner';
import { RedirectOptions, RedirectSigner } from './RedirectSigner';
import { GenericSignatureRequest }         from '../models/transaction/GenericSignatureRequest';
import { ConfirmationRequest }             from '../models/ConfirmationRequest';
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

export interface SignerResult extends PopupResult {}
