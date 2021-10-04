import { ConfirmationRequestType } from '../ConfirmationRequestType';
import { ConfirmationRequest }     from '../ConfirmationRequest';
import { SecretType }              from '../SecretType';

export class ImportWalletRequest implements ConfirmationRequest {

    public walletId: string;
    public to: SecretType;
    public readonly confirmationRequestType: ConfirmationRequestType;

    public static fromData(data: ImportWalletRequest): ImportWalletRequest {
        return new this(data.walletId, data.to);
    }

    constructor(walletId: string,
                to: SecretType) {
        this.walletId = walletId;
        this.to = to;
        this.confirmationRequestType = ConfirmationRequestType.IMPORT_WALLET;
    }
}
