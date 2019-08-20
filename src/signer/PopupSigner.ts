import { ConfirmationRequest }            from '../models/ConfirmationRequest';
import { EventTypes }                     from '../types/EventTypes';
import { BuildTransactionRequest }        from '../models/transaction/build/BuildTransactionRequest';
import { GenericSignatureRequest }        from '../models/transaction/GenericSignatureRequest';
import Utils                              from '../utils/Utils';
import { Signer, SignerResult }           from '../signer/Signer';
import { TransactionRequest }             from '..';
import Popup                              from '../popup/Popup';
import { RequestDataType }                from '../models/RequestDataType';
import { BuildSimpleTransactionRequest }  from '../models/transaction/build/BuildSimpleTransactionRequest';
import { BuildTokenTransferRequest }      from '../models/transaction/build/BuildTokenTransferRequest';
import { BuildNftTransferRequest }        from '../models/transaction/build/BuildNftTransferRequest';
import { BuildGasTransferRequest }        from '../models/transaction/build/BuildGasTransferRequest';
import { BuildTransferRequestDto }        from '../models/transaction/build/BuildTransferRequestDto';
import { BuildTokenTransferRequestDto }   from '../models/transaction/build/BuildTokenTransferRequestDto';
import { BuildNftTransferRequestDto }     from '../models/transaction/build/BuildNftTransferRequestDto';
import { BuildGasTransferRequestDto }     from '../models/transaction/build/BuildGasTransferRequestDto';
import { BuildGenericTransferRequestDto } from '../models/transaction/build/BuildGenericTransferRequestDto';

export class PopupSigner implements Signer {

    private popup: PopupSignerPopup;
    private bearerTokenProvider: () => string;

    constructor(bearerTokenProvider: () => string) {
        this.bearerTokenProvider = bearerTokenProvider;
        this.popup = new PopupSignerPopup(`${Utils.urls.connect}/popup/transaction/init.html`, this.bearerTokenProvider);
        window.addEventListener('beforeunload', () => {
            this.closePopup();
        });
    }

    public closePopup() {
        this.popup.close();
    }

    public isOpen(): boolean {
        return this.popup.isOpen();
    }

    public async sign(signatureRequest: GenericSignatureRequest): Promise<SignerResult> {
        signatureRequest.hash = typeof signatureRequest.hash === 'undefined' ? true : signatureRequest.hash;
        signatureRequest.prefix = typeof signatureRequest.hash === 'undefined' ? true : signatureRequest.prefix;
        return this.handleRequest('sign', signatureRequest);
    }

    /** Deprecated since 1.1.9. Use sign instead */
    public async signTransaction(signatureRequest: GenericSignatureRequest): Promise<SignerResult> {
        return this.sign(signatureRequest);
    }

    public async executeNativeTransaction(transactionRequest: TransactionRequest): Promise<SignerResult> {
        return this.execute(transactionRequest);
    }

    /** Deprecated since 1.4.0. Use transfer functions instead */
    public async executeTransaction(genericTransactionRequestOrTransactionId: BuildGenericTransferRequestDto | string): Promise<SignerResult> {
        if (typeof genericTransactionRequestOrTransactionId === 'string') {
            return this.execute({transactionId: genericTransactionRequestOrTransactionId});
        } else {
            return this.execute(BuildTransactionRequest.fromData(genericTransactionRequestOrTransactionId));
        }
    }

    public executeTransfer(buildTransactionData: BuildTransferRequestDto): Promise<SignerResult> {
        return this.execute(BuildSimpleTransactionRequest.fromData(buildTransactionData));
    }

    public executeTokenTransfer(buildTransactionData: BuildTokenTransferRequestDto): Promise<SignerResult> {
        return this.execute(BuildTokenTransferRequest.fromData(buildTransactionData));
    }

    public executeNftTransfer(buildTransactionData: BuildNftTransferRequestDto): Promise<SignerResult> {
        return this.execute(BuildNftTransferRequest.fromData(buildTransactionData));
    }

    public executeGasTransfer(buildTransactionData: BuildGasTransferRequestDto): Promise<SignerResult> {
        return this.execute(BuildGasTransferRequest.fromData(buildTransactionData));
    }

    public async confirm(request: ConfirmationRequest): Promise<SignerResult> {
        this.popup.focus();
        return this.handleRequest('confirm', request);
    }

    private async execute(requestData: RequestDataType): Promise<SignerResult> {
        return this.handleRequest('execute', requestData);
    }

    private async handleRequest(action: string, requestData: RequestDataType): Promise<SignerResult> {
        this.popup.focus();
        return this.popup
                   .sendData(action, Object.assign({}, requestData))
                   .finally(() => {
                       this.closePopup()
                   });
    }
}

class PopupSignerPopup extends Popup {

    protected finishedEventType = EventTypes.SIGNER_FINISHED;
    protected sendDataEventType = EventTypes.SEND_TRANSACTION_DATA;

    constructor(url: string, bearerTokenProvider: () => string) {
        super(url, bearerTokenProvider);
    }

    public sendData(
        action: string,
        requestData: RequestDataType
    ): Promise<SignerResult> {
        return new Promise((resolve, reject) => {
            this.onPopupMountedQueue.push(this.attachFinishedListener(resolve, reject));
            this.onPopupMountedQueue.push(this.sendDataToPopup(action, requestData));
            this.processPopupMountedQueue();
        }) as Promise<SignerResult>;
    }

    protected sendDataToPopup(
        action: string,
        requestData: RequestDataType
    ): () => void {
        return () => {
            if (this.isOpen()) {
                this.popupWindow.postMessage(
                    {type: this.sendDataEventType, params: {action, transactionRequest: requestData, bearerToken: this.bearerTokenProvider()}},
                    Utils.urls.connect
                );
            }
        };
    }
}
