import { GenericTransactionRequest } from '../models/transaction/GenericTransactionRequest';
import Utils                         from '../utils/Utils';
import { Signer, SignerResult }      from '../signer/Signer';

export class RedirectSigner implements Signer {

    private bearerTokenProvider: () => string;

    constructor(bearerTokenProvider: () => string) {
        this.bearerTokenProvider = bearerTokenProvider;
    }

    public executeNativeTransaction(transactionRequest: any, options: { redirectUri?: string, correlationID?: string } = {}): Promise<SignerResult> {
        this.checkRedirectUri(options);
        return new Promise<SignerResult>((resolve, reject) => {
            Utils.http().postInForm(`${Utils.urls.connect}/transaction/execute/${transactionRequest.type.toLowerCase()}`, transactionRequest, this.bearerTokenProvider, options);
            resolve();
        });
    }

    public executeTransaction(genericTransactionRequest: GenericTransactionRequest, options: { redirectUri?: string, correlationID?: string } = {}): Promise<SignerResult> {
        this.checkRedirectUri(options);
        return new Promise<SignerResult>((resolve, reject) => {
            Utils.http().postInForm(`${Utils.urls.connect}/transaction/execute`, genericTransactionRequest, this.bearerTokenProvider, options);
            resolve();
        });
    }

    public signTransaction(signatureRequest: any, options: { redirectUri?: string, correlationID?: string } = {}): Promise<SignerResult> {
        this.checkRedirectUri(options);
        return new Promise<SignerResult>((resolve, reject) => {
            Utils.http().postInForm(`${Utils.urls.connect}/transaction/sign/${signatureRequest.type.toLowerCase()}`, signatureRequest, this.bearerTokenProvider, options);
            resolve();
        });
    }

    private checkRedirectUri(options: { redirectUri?: string; correlationID?: string }) {
        if (!options.redirectUri) {
            options.redirectUri = window.location.href;
        }
    }
}
