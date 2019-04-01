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

    public executeTransaction(genericTransactionRequest: GenericTransactionRequest, redirectOptions?: RedirectOptions): Promise<SignerResult> {
        return new Promise<SignerResult>((resolve, reject) => {
            Utils.http().postInForm(`${Utils.urls.connect}/transaction/execute`, genericTransactionRequest, this.bearerTokenProvider, redirectOptions);
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
}
