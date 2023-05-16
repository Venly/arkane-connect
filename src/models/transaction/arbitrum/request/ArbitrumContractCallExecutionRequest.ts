import {TransactionRequest} from '../../TransactionRequest';

export interface ArbitrumContractCallInput {
    type: string;
    value: string;
}

export class ArbitrumContractCallExecutionRequest extends TransactionRequest {
    public gasPrice?: number;
    public gas?: number;
    public nonce?: number;
    public to!: string;
    public value!: number;
    public functionName!: string;
    public inputs: ArbitrumContractCallInput[] = [];
}
