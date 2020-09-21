import { SecretType }                from '../../SecretType';
import { BuildSignRequestBase }      from './BuildSignRequestBase';
import { BuildSignRequestBaseDto }   from './BuildSignRequestBaseDto';
import { BuildSignatureRequestType } from './BuildSignatureRequestType';
import { BuildEip712SignRequestDto } from './BuildEip712SignRequestDto';

export class BuildEip712SignRequest extends BuildSignRequestBase implements BuildSignRequestBaseDto {

    public static fromData(requestData: BuildEip712SignRequestDto): BuildEip712SignRequest {
        const {walletId, secretType, data} = requestData;
        return new this(walletId, secretType, data);
    }

    public data!: any;

    constructor(walletId: string,
                secretType: SecretType,
                data: any) {
        super(BuildSignatureRequestType.EIP712, walletId, secretType);
        this.data = data;
    }
}
