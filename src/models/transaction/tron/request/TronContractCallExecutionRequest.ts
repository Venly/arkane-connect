import {TransactionRequest} from '../../TransactionRequest';

export interface TronContractCallInput {
    type: string;
    value: string;
}

export class TronContractCallExecutionRequest extends TransactionRequest {
    public value!: number;
    public to!: string;
    public functionName!: string;
    public inputs: TronContractCallInput[] = [];
}
