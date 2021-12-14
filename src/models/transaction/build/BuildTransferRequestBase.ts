import { SecretType }                  from '../../SecretType';
import { Network }                     from '../../Network';
import { BuildTransactionRequestType } from './BuildTransactionRequestType';
import { BuildTransferRequestBaseDto } from './BuildTransferRequestBaseDto';

export abstract class BuildTransferRequestBase implements BuildTransferRequestBaseDto {
    public walletId!: string;
    public to!: string;
    public secretType!: SecretType;
    public network?: Network;
    public chainSpecificFields?: any;

    private type: BuildTransactionRequestType;

    constructor(type: BuildTransactionRequestType, walletId: string, to: string, secretType: SecretType, network?: Network, chainSpecificFields?: string) {
        this.type = type;
        this.walletId = walletId;
        this.to = to;
        this.secretType = secretType;
        network ? this.network = network : undefined;
        chainSpecificFields ? this.chainSpecificFields = chainSpecificFields : undefined;
    }
}
