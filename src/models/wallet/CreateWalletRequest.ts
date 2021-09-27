import { SecretType }              from '../SecretType';
import { ConfirmationRequest }     from '../ConfirmationRequest';
import { ConfirmationRequestType } from '../ConfirmationRequestType';


export abstract class CreateWalletRequest implements ConfirmationRequest {

    public abstract readonly confirmationRequestType: ConfirmationRequestType;

    public readonly secretType: SecretType;

    public description?: string;

    constructor(secretType: SecretType) {
        this.secretType = secretType;
    }
}
