import { PopupSigner }                      from './PopupSigner';
import { RedirectOptions, RedirectSigner }  from './RedirectSigner';
import { ConfirmationRequest }              from '../models/ConfirmationRequest';
import { GenericSignatureRequest }          from '../models/transaction/GenericSignatureRequest';
import { WindowMode }                       from '../models/WindowMode';
import { PopupResult }                      from '../popup/PopupResult';
import { BuildGasTransferRequestDto }       from '../models/transaction/build/BuildGasTransferRequestDto';
import { BuildNftTransferRequestDto }       from '../models/transaction/build/BuildNftTransferRequestDto';
import { BuildTokenTransferRequestDto }     from '../models/transaction/build/BuildTokenTransferRequestDto';
import { BuildGenericTransferRequestDto }   from '../models/transaction/build/BuildGenericTransferRequestDto';
import { BuildTransferRequestDto }          from '../models/transaction/build/BuildTransferRequestDto';
import { BuildContractExecutionRequestDto } from '../models/transaction/build/BuildContractExecutionRequestDto';
import { PopupOptions }                     from '../popup/Popup';
import { BuildMessageSignRequestDto }       from '../models/transaction/build/BuildMessageSignRequestDto';
import { BuildEip712SignRequestDto }        from '../models/transaction/build/BuildEip712SignRequestDto';
import { ImportWalletRequest }              from '../models/wallet/ImportWalletRequest';


export interface Signer {
    /** Deprecated since 1.4.0 Use specific transfer functions */
    executeTransaction: (genericTransactionRequestOrTransactionId: BuildGenericTransferRequestDto | string, RedirectOptions?: RedirectOptions) => Promise<SignerResult>;
    executeNativeTransaction: (transactionRequest: any, RedirectOptions?: RedirectOptions) => Promise<SignerResult>;
    executeTransfer: (buildTransactionData: BuildTransferRequestDto, redirectOptions?: RedirectOptions) => Promise<SignerResult>;
    executeTokenTransfer: (buildTransactionData: BuildTokenTransferRequestDto, redirectOptions?: RedirectOptions) => Promise<SignerResult>,
    executeNftTransfer: (buildTransactionData: BuildNftTransferRequestDto, redirectOptions?: RedirectOptions) => Promise<SignerResult>,
    executeGasTransfer: (buildTransactionData: BuildGasTransferRequestDto,
                         redirectOptions?: RedirectOptions) => Promise<SignerResult>,
    executeContract: (buildTransactionData: BuildContractExecutionRequestDto,
                      redirectOptions?: RedirectOptions) => Promise<SignerResult>,
    executeSavedTransaction: (transactionId: string,
                              redirectOptions?: RedirectOptions) => Promise<SignerResult>;
    resubmitTransaction: (transactionId: string,
                          redirectOptions?: RedirectOptions) => Promise<SignerResult>;
    cancelTransaction: (transactionId: string,
                        redirectOptions?: RedirectOptions) => Promise<SignerResult>;
    sign: (signatureRequest: GenericSignatureRequest,
           redirectOptions?: RedirectOptions) => Promise<SignerResult>;
    signMessage: (buildSignatureData: BuildMessageSignRequestDto,
                  redirectOptions?: RedirectOptions) => Promise<SignerResult>;
    signEip712: (buildSignatureData: BuildEip712SignRequestDto,
                 redirectOptions?: RedirectOptions) => Promise<SignerResult>;
    /** Deprecated since 1.1.9. Use sign instead */
    signTransaction: (signatureRequest: GenericSignatureRequest,
                      redirectOptions?: RedirectOptions) => Promise<SignerResult>;
    importWallet: (request: ImportWalletRequest,
                   redirectOptions?: RedirectOptions) => Promise<SignerResult>;
    confirm: (request: ConfirmationRequest,
              redirectOptions?: RedirectOptions) => Promise<SignerResult>;
}

export class SignerFactory {

    public static createSignerFor(signMethod: WindowMode, bearerTokenProvider: () => string, popupOptions?: PopupOptions): Signer {
        switch (signMethod) {
            case WindowMode.POPUP:
                return new PopupSigner(bearerTokenProvider, popupOptions);
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
