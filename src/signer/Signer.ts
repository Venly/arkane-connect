import { PopupSigner }                      from './PopupSigner';
import { RedirectOptions, RedirectSigner }  from './RedirectSigner';
import { ConfirmationRequest }              from '../models/ConfirmationRequest';
import { GenericSignatureRequest }          from '../models/transaction/GenericSignatureRequest';
import { WindowMode }                       from '../models/WindowMode';
import { PopupResult }                      from '../popup/PopupResult';
import { BuildGasTransactionRequestDto }    from '../models/transaction/build/BuildGasTransactionRequestDto';
import { BuildNftTransactionRequestDto }    from '../models/transaction/build/BuildNftTransactionRequestDto';
import { BuildTokenTransactionRequestDto }  from '../models/transaction/build/BuildTokenTransactionRequestDto';
import { BuildTransactionRequestDto }       from '../models/transaction/build/BuildTransactionRequestDto';
import { BuildSimpleTransactionRequestDto } from '../models/transaction/build/BuildSimpleTransactionRequestDto';


export interface Signer {
    /** Deprecated since 1.4.0 Use specific transfer functions */
    executeTransaction: (genericTransactionRequestOrTransactionId: BuildTransactionRequestDto | string, RedirectOptions?: RedirectOptions) => Promise<SignerResult>;
    executeNativeTransaction: (transactionRequest: any, RedirectOptions?: RedirectOptions) => Promise<SignerResult>;
    executeTransfer: (buildTransactionData: BuildSimpleTransactionRequestDto, redirectOptions?: RedirectOptions) => Promise<SignerResult>;
    executeTokenTransfer: (buildTransactionData: BuildTokenTransactionRequestDto, redirectOptions?: RedirectOptions) => Promise<SignerResult>,
    executeNftTransfer: (buildTransactionData: BuildNftTransactionRequestDto, redirectOptions?: RedirectOptions) => Promise<SignerResult>,
    executeGasTransfer: (buildTransactionData: BuildGasTransactionRequestDto, redirectOptions?: RedirectOptions) => Promise<SignerResult>,
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
