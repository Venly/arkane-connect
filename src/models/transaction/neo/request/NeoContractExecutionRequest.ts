import {TransactionRequest} from '../../TransactionRequest';
import NeoContractCallOutput from "./NeoContractCallOutput";

export interface NeoContractCallInput {
    type: string;
    value: string;
}

export class NeoContractExecutionRequest extends TransactionRequest {
    public to!: string;
    public functionName: string = "";
    public inputs: NeoContractCallInput[] = [];
    public outputs: NeoContractCallOutput[] = [];
}
