import { SecretType } from '../../SecretType';

export abstract class BuildSignRequestBaseDto {
    public walletId!: string;
    public secretType!: SecretType;
}
