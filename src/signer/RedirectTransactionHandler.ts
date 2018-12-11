import { TransactionHandler }        from './TransactionHandler';
import ResponseBody                  from '../api/ResponseBody';
import { GenericTransactionRequest } from '../models/transaction/GenericTransactionRequest';
import Utils                         from '../utils/Utils';

export class RedirectTransactionHandler implements TransactionHandler {

    private bearerTokenProvider: () => string;

    constructor(bearerTokenProvider: () => string) {
        this.bearerTokenProvider = bearerTokenProvider;
    }

    public executeNativeTransaction(transactionRequest: any, options?: { redirectUri?: string, correlationID?: string }): Promise<ResponseBody> {
        return new Promise<ResponseBody>((resolve, reject) => {
            console.log('options', options);
            Utils.http().postInForm(`${Utils.urls.connectWeb}/transaction/execute/${transactionRequest.type.toLowerCase()}`, transactionRequest, this.bearerTokenProvider, options);
            resolve();
        });
    }

    public executeTransaction(genericTransactionRequest: GenericTransactionRequest, options?: { redirectUri?: string, correlationID?: string }): Promise<ResponseBody> {
        return new Promise<ResponseBody>((resolve, reject) => {
            console.log('options', options);
            Utils.http().postInForm(`${Utils.urls.connectWeb}/transaction/execute`, genericTransactionRequest, this.bearerTokenProvider, options);
            resolve();
        });
    }

    public signTransaction(transactionRequest: any, options?: { redirectUri?: string, correlationID?: string }): Promise<ResponseBody> {
        return new Promise<ResponseBody>((resolve, reject) => {
            console.log('options', options);
            Utils.http().postInForm(`${Utils.urls.connectWeb}/transaction/sign/${transactionRequest.type.toLowerCase()}`, transactionRequest, this.bearerTokenProvider, options);
            resolve();
        });
    }
}
