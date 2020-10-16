import {TransactionRequest} from '../../TransactionRequest';

export interface BscContractCallInput {
    type: string;
    value: string;
}

export class BscContractCallExecutionRequest extends TransactionRequest {
    public gasPrice?: number;
    public gas?: number;
    public nonce?: number;
    public to!: string;
    public value!: number;
    public functionName!: string;
    public inputs: BscContractCallInput[] = [];
}
