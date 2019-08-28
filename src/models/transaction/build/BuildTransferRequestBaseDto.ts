import { SecretType } from '../../SecretType';
import { Network }    from '../../Network';

export abstract class BuildTransferRequestBaseDto {
    public walletId!: string;
    public to!: string;
    public secretType!: SecretType;
    public alias?: string;
    public network?: Network;
}
