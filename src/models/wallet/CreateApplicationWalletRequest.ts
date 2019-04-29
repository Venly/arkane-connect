import { SecretType }              from '../SecretType';
import { ConfirmationRequest }     from '../ConfirmationRequest';
import { ConfirmationRequestType } from '../ConfirmationRequestType';


export class CreateApplicationWalletRequest implements ConfirmationRequest {

    public readonly confirmationRequestType = ConfirmationRequestType.CREATE_APPLICATION_WALLET;

    public readonly secretType: SecretType;

    public alias?: string;

    public desciption?: string;

    constructor(secretType: SecretType) {
        this.secretType = secretType;
    }
}
