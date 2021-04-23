import {TransactionRequest} from '../../TransactionRequest';

export interface AvacContractCallInput {
    type: string;
    value: string;
}

export class AvacContractCallExecutionRequest extends TransactionRequest {
    public gasPrice?: number;
    public gas?: number;
    public nonce?: number;
    public to!: string;
    public value!: number;
    public functionName!: string;
    public inputs: AvacContractCallInput[] = [];
}
