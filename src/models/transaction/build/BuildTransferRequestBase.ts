import { SecretType }                  from '../../SecretType';
import { Network }                     from '../../Network';
import { BuildTransactionRequestType } from './BuildTransactionRequestType';
import { BuildTransferRequestBaseDto } from './BuildTransferRequestBaseDto';

export abstract class BuildTransferRequestBase implements BuildTransferRequestBaseDto {
    public walletId!: string;
    public to!: string;
    public secretType!: SecretType;
    public network?: Network;
    public memo?:string;

    private type: BuildTransactionRequestType;

    constructor(type: BuildTransactionRequestType, walletId: string, to: string, secretType: SecretType, network?: Network, memo?: string) {
        this.type = type;
        this.walletId = walletId;
        this.to = to;
        this.secretType = secretType;
        network ? this.network = network : undefined;
        memo ? this.memo = memo : undefined;
    }
}
