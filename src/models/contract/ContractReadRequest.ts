import { SecretType }                     from '../SecretType';
import { ContractReadRequestInputParam }  from './ContractReadRequestInputParam';
import { ContractReadRequestOutputParam } from './ContractReadRequestOutputParam';

export class ContractReadRequest {
    public userId!: string;
    public hasMasterPin = false;
    public username!: string;
    public email!: string;
    public firstName!: string;
    public lastName!: string;
    public nickname!: string;

    public secretType!: SecretType;
    public walletAddress?: string;
    public contractAddress!: string;
    public functionName!: string;
    public inputs!: ContractReadRequestInputParam[];
    public outputs!: ContractReadRequestOutputParam[];
}
