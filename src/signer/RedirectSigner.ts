import { GenericTransactionRequest } from '../models/transaction/GenericTransactionRequest';
import Utils                         from '../utils/Utils';
import { Signer, SignerResult }      from '../signer/index';

export class RedirectSigner implements Signer {

    private bearerTokenProvider: () => string;

    constructor(bearerTokenProvider: () => string) {
        this.bearerTokenProvider = bearerTokenProvider;
    }

    public executeNativeTransaction(transactionRequest: any, options?: { redirectUri?: string, correlationID?: string }): Promise<SignerResult> {
        return new Promise<SignerResult>((resolve, reject) => {
            Utils.http().postInForm(`${Utils.urls.connect}/transaction/execute/${transactionRequest.type.toLowerCase()}`, transactionRequest, this.bearerTokenProvider, options);
            resolve();
        });
    }

    public executeTransaction(genericTransactionRequest: GenericTransactionRequest, options?: { redirectUri?: string, correlationID?: string }): Promise<SignerResult> {
        return new Promise<SignerResult>((resolve, reject) => {
            Utils.http().postInForm(`${Utils.urls.connect}/transaction/execute`, genericTransactionRequest, this.bearerTokenProvider, options);
            resolve();
        });
    }

    public signTransaction(transactionRequest: any, options?: { redirectUri?: string, correlationID?: string }): Promise<SignerResult> {
        return new Promise<SignerResult>((resolve, reject) => {
            Utils.http().postInForm(`${Utils.urls.connect}/transaction/sign/${transactionRequest.type.toLowerCase()}`, transactionRequest, this.bearerTokenProvider, options);
            resolve();
        });
    }
}
