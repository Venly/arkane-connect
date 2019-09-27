import {TransactionRequest} from '../../TransactionRequest';

export interface NeoContractCallInput {
    type: string;
    value: string;
}

export class NeoContractExecutionRequest extends TransactionRequest {
    public to!: string;
    public functionName: string = "";
    public inputs: NeoContractCallInput[] = [];
}
