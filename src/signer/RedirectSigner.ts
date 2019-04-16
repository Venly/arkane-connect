import { ConfirmationRequest }       from '../models/ConfirmationRequest';
import { GenericSignatureRequest }   from '../models/transaction/GenericSignatureRequest';
import { GenericTransactionRequest } from '../models/transaction/GenericTransactionRequest';
import { Signer, SignerResult }      from '../signer/Signer';
import Utils                         from '../utils/Utils';

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

    public executeTransaction(genericTransactionRequestOrTransactionId: GenericTransactionRequest | string, redirectOptions?: RedirectOptions): Promise<SignerResult> {
        if (typeof genericTransactionRequestOrTransactionId === 'string') {
            return this.executeSavedTransaction(genericTransactionRequestOrTransactionId, redirectOptions);
        } else {
            return this.executeProvidedTransaction(genericTransactionRequestOrTransactionId, redirectOptions);
        }
    }

    private executeSavedTransaction(transactionId: string, redirectOptions?: RedirectOptions) {
        return new Promise<SignerResult>((resolve, reject) => {
            Utils.http().postInForm(`${Utils.urls.connect}/transaction/execute/${transactionId}`, {}, this.bearerTokenProvider, redirectOptions);
            resolve();
        });
    }

    private executeProvidedTransaction(transactionRequest: GenericTransactionRequest, redirectOptions?: RedirectOptions) {
        return new Promise<SignerResult>((resolve, reject) => {
            Utils.http().postInForm(`${Utils.urls.connect}/transaction/execute`, transactionRequest, this.bearerTokenProvider, redirectOptions);
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
