import { SecretType } from '../../SecretType';
import { Network }    from '../../Network';

export abstract class BuildTransferRequestBaseDto {
    public walletId!: string;
    public to!: string;
    public secretType!: SecretType;
    public network?: Network;
    public chainSpecificFields?: any;
}
