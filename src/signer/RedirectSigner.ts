import { ConfirmationRequest }              from '../models/ConfirmationRequest';
import { GenericSignatureRequest }          from '../models/transaction/GenericSignatureRequest';
import { BuildTransactionRequest }          from '../models/transaction/build/BuildTransactionRequest';
import { Signer, SignerResult }             from '../signer/Signer';
import Utils                                from '../utils/Utils';
import { BuildGasTransactionRequest }       from '../models/transaction/build/BuildGasTransactionRequest';
import { BuildTokenTransactionRequest }     from '../models/transaction/build/BuildTokenTransactionRequest';
import { BuildNftTransactionRequest }       from '../models/transaction/build/BuildNftTransactionRequest';
import { BuildSimpleTransactionRequest }    from '../models/transaction/build/BuildSimpleTransactionRequest';
import { BuildTransactionRequestBase }      from '../models/transaction/build/BuildTransactionRequestBase';
import { BuildTransactionRequestDto }       from '../models/transaction/build/BuildTransactionRequestDto';
import { BuildSimpleTransactionRequestDto } from '../models/transaction/build/BuildSimpleTransactionRequestDto';
import { BuildTokenTransactionRequestDto }  from '../models/transaction/build/BuildTokenTransactionRequestDto';
import { BuildNftTransactionRequestDto }    from '../models/transaction/build/BuildNftTransactionRequestDto';
import { BuildGasTransactionRequestDto }    from '../models/transaction/build/BuildGasTransactionRequestDto';

export interface RedirectOptions {
    redirectUri?: string,
    correlationID?: string
}

export class RedirectSigner implements Signer {

    private readonly bearerTokenProvider: () => string;

    constructor(bearerTokenProvider: () => string) {
        this.bearerTokenProvider = bearerTokenProvider;
    }

    public executeNativeTransaction(transactionRequest: any, redirectOptions?: RedirectOptions): Promise<SignerResult> {
        return new Promise<SignerResult>((resolve, reject) => {
            Utils.http().postInForm(
                `${Utils.urls.connect}/transaction/execute/${transactionRequest.type.toLowerCase()}`,
                transactionRequest,
                this.bearerTokenProvider,
                redirectOptions
            );
            resolve();
        });
    }

    /** @Deprecated */
    public executeTransaction(buildTransactionRequestOrTransactionId: BuildTransactionRequestDto | string, redirectOptions?: RedirectOptions): Promise<SignerResult> {
        if (typeof buildTransactionRequestOrTransactionId === 'string') {
            return this.executeSavedTransaction(buildTransactionRequestOrTransactionId, redirectOptions);
        } else {
            return this.executeProvidedTransaction(BuildTransactionRequest.fromData(buildTransactionRequestOrTransactionId), redirectOptions);
        }
    }

    public executeTransfer(buildTransactionData: BuildSimpleTransactionRequestDto, redirectOptions?: RedirectOptions): Promise<SignerResult> {
        return this.executeProvidedTransaction(BuildSimpleTransactionRequest.fromData(buildTransactionData), redirectOptions);

    }

    public executeTokenTransfer(buildTransactionData: BuildTokenTransactionRequestDto, redirectOptions?: RedirectOptions): Promise<SignerResult> {
        return this.executeProvidedTransaction(BuildTokenTransactionRequest.fromData(buildTransactionData), redirectOptions);
    }

    public executeNftTransfer(buildTransactionData: BuildNftTransactionRequestDto, redirectOptions?: RedirectOptions): Promise<SignerResult> {
        return this.executeProvidedTransaction(BuildNftTransactionRequest.fromData(buildTransactionData), redirectOptions);
    }

    public executeGasTransfer(buildTransactionData: BuildGasTransactionRequestDto, redirectOptions?: RedirectOptions): Promise<SignerResult> {
        return this.executeProvidedTransaction(BuildGasTransactionRequest.fromData(buildTransactionData), redirectOptions);
    }

    public executeSavedTransaction(transactionId: string, redirectOptions?: RedirectOptions) {
        return new Promise<SignerResult>((resolve, reject) => {
            Utils.http().postInForm(`${Utils.urls.connect}/transaction/execute/${transactionId}`, {}, this.bearerTokenProvider, redirectOptions);
            resolve();
        });
    }

    private executeProvidedTransaction(buildTransactionData: BuildTransactionRequestBase, redirectOptions?: RedirectOptions) {
        return new Promise<SignerResult>((resolve, reject) => {
            Utils.http().postInForm(`${Utils.urls.connect}/transaction/execute`, buildTransactionData, this.bearerTokenProvider, redirectOptions);
            resolve();
        });
    }

    public sign(signatureRequest: GenericSignatureRequest, redirectOptions?: RedirectOptions): Promise<SignerResult> {
        return new Promise<SignerResult>((resolve, reject) => {
            Utils.http().postInForm(`${Utils.urls.connect}/transaction/sign/${signatureRequest.type.toLowerCase()}`, signatureRequest, this.bearerTokenProvider, redirectOptions);
            resolve();
        });
    }

    /** Deprecated since v1.1.9: Use 'sign' instead. */
    public signTransaction(signatureRequest: GenericSignatureRequest, redirectOptions?: RedirectOptions): Promise<SignerResult> {
        return this.sign(signatureRequest, redirectOptions);
    }

    public async confirm(request: ConfirmationRequest, redirectOptions?: RedirectOptions): Promise<SignerResult> {
        return new Promise<SignerResult>((resolve, reject) => {
            Utils.http().postInForm(`${Utils.urls.connect}/confirm/${request.confirmationRequestType.toLowerCase()}`, request, this.bearerTokenProvider, redirectOptions);
            resolve();
        });
    }
}
