import { SecretType }                 from '../../SecretType';
import { BuildSignRequestBase }       from './BuildSignRequestBase';
import { BuildSignRequestBaseDto }    from './BuildSignRequestBaseDto';
import { BuildSignatureRequestType }  from './BuildSignatureRequestType';
import { BuildMessageSignRequestDto } from './BuildMessageSignRequestDto';

export class BuildMessageSignRequest extends BuildSignRequestBase implements BuildSignRequestBaseDto {

    public static fromData(requestData: BuildMessageSignRequestDto): BuildMessageSignRequest {
        const {walletId, secretType, data} = requestData;
        return new this(walletId, secretType, data);
    }

    public data!: string;

    constructor(walletId: string, secretType: SecretType, data: string) {
        super(BuildSignatureRequestType.MESSAGE, walletId, secretType);
        this.data = data;
    }
}
