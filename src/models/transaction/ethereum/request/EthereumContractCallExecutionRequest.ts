import {TransactionRequest} from '../../TransactionRequest';

export interface EthereumContractCallInput {
    type: string;
    value: string;
}

export class EthereumContractCallExecutionRequest extends TransactionRequest {
    public gasPrice?: number;
    public gas?: number;
    public nonce?: number;
    public contractAddress!: string;
    public amount!: number;
    public functionName!: string;
    public inputs: EthereumContractCallInput[] = [];
}
