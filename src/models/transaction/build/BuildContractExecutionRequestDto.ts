import {BuildTransferRequestBaseDto} from './BuildTransferRequestBaseDto';
import {ContractCallInputDto} from './ContractCallInputDto';

export class BuildContractExecutionRequestDto extends BuildTransferRequestBaseDto {
    public functionName!: string;
    public inputs!: ContractCallInputDto[];
    public chainSpecificFields?: any;
    public value?: number;
}
