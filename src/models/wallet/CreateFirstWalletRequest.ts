import { ConfirmationRequestType } from '../ConfirmationRequestType';
import { CreateWalletRequest }     from './CreateWalletRequest';


export class CreateFirstWalletRequest extends CreateWalletRequest {

    public readonly confirmationRequestType = ConfirmationRequestType.CREATE_FIRST_WALLET;
}
