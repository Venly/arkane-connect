import { SecretType }                from '../../SecretType';
import { BuildSignRequestBaseDto }   from './BuildSignRequestBaseDto';
import { BuildSignatureRequestType } from './BuildSignatureRequestType';

export abstract class BuildSignRequestBase implements BuildSignRequestBaseDto {
    public secretType!: SecretType;
    public walletId!: string;

    private type: BuildSignatureRequestType;

    constructor(type: BuildSignatureRequestType, walletId: string, secretType: SecretType) {
        this.type = type;
        this.walletId = walletId;
        this.secretType = secretType;
    }
}
