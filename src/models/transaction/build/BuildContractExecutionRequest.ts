import {BuildTransferRequestBase} from './BuildTransferRequestBase';
import {BuildTransactionRequestType} from './BuildTransactionRequestType';
import {SecretType} from '../../SecretType';
import {Network} from '../../Network';
import {BuildContractExecutionRequestDto} from './BuildContractExecutionRequestDto';
import {ContractCallInput} from './ContractCallInput';

export class BuildContractExecutionRequest extends BuildTransferRequestBase {

    public functionName!: string;
    public value?: number;
    public inputs: ContractCallInput[];
    public chainSpecificFields?: any;

    public static fromData(data: BuildContractExecutionRequestDto): BuildContractExecutionRequest {
        const {walletId, to, secretType, network, functionName, value, chainSpecificFields} = data;
        const inputs = data.inputs ? data.inputs.map((inputDto) => ContractCallInput.fromData(inputDto)) : [];
        return new this(walletId, to, secretType, functionName, inputs, value, chainSpecificFields, network);
    }

    constructor(walletId: string, to: string, secretType: SecretType, functionName: string, inputs: ContractCallInput[], value?: number, chainSpecificFields?: any, network?: Network) {
        super(BuildTransactionRequestType.CONTRACT_EXECUTION, walletId, to, secretType, network);
        this.functionName = functionName;
        this.value = value;
        this.inputs = inputs;
        this.chainSpecificFields = chainSpecificFields;
    }
}
