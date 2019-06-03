import { ConfirmationRequestType } from '../ConfirmationRequestType';
import { CreateWalletRequest }     from './CreateWalletRequest';


export class CreateApplicationWalletRequest extends CreateWalletRequest {

    public readonly confirmationRequestType = ConfirmationRequestType.CREATE_APPLICATION_WALLET;
}
