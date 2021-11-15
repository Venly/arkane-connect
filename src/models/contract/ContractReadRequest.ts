import { SecretType }                     from '../SecretType';
import { ContractReadRequestInputParam }  from './ContractReadRequestInputParam';
import { ContractReadRequestOutputParam } from './ContractReadRequestOutputParam';

export class ContractReadRequest {
    public secretType!: SecretType;
    public walletAddress?: string;
    public contractAddress!: string;
    public functionName!: string;
    public inputs!: ContractReadRequestInputParam[];
    public outputs!: ContractReadRequestOutputParam[];
}
