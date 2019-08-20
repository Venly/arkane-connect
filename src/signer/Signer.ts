import { PopupSigner }                     from './PopupSigner';
import { RedirectOptions, RedirectSigner } from './RedirectSigner';
import { ConfirmationRequest }             from '../models/ConfirmationRequest';
import { GenericSignatureRequest }         from '../models/transaction/GenericSignatureRequest';
import { BuildTransactionRequest }         from '../models/transaction/build/BuildTransactionRequest';
import { WindowMode }                      from '../models/WindowMode';
import { PopupResult }                     from '../popup/PopupResult';
import { BuildSimpleTransactionRequest }   from '../models/transaction/build/BuildSimpleTransactionRequest';
import { BuildTokenTransactionRequest }    from '../models/transaction/build/BuildTokenTransactionRequest';
import { BuildNftTransactionRequest }      from '../models/transaction/build/BuildNftTransactionRequest';
import { BuildGasTransactionRequest }      from '../models/transaction/build/BuildGasTransactionRequest';


export interface Signer {
    /** Deprecated since 1.4.1 Use specific transfer functions */
    executeTransaction: (genericTransactionRequestOrTransactionId: BuildTransactionRequest | string, RedirectOptions?: RedirectOptions) => Promise<SignerResult>;
    executeNativeTransaction: (transactionRequest: any, RedirectOptions?: RedirectOptions) => Promise<SignerResult>;
    executeTransfer: (buildTransactionData: BuildSimpleTransactionRequest, redirectOptions?: RedirectOptions) => Promise<SignerResult>;
    executeTokenTransfer: (buildTransactionData: BuildTokenTransactionRequest, redirectOptions?: RedirectOptions) => Promise<SignerResult>,
    executeNftTransfer: (buildTransactionData: BuildNftTransactionRequest, redirectOptions?: RedirectOptions) => Promise<SignerResult>,
    executeGasTransfer: (buildTransactionData: BuildGasTransactionRequest, redirectOptions?: RedirectOptions) => Promise<SignerResult>,
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
