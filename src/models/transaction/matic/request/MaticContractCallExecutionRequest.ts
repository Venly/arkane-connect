import {TransactionRequest} from '../../TransactionRequest';

export interface MaticContractCallInput {
    type: string;
    value: string;
}

export class MaticContractCallExecutionRequest extends TransactionRequest {
    public gasPrice?: number;
    public gas?: number;
    public nonce?: number;
    public to!: string;
    public value!: number;
    public functionName!: string;
    public inputs: MaticContractCallInput[] = [];
}
