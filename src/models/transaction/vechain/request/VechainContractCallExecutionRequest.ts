import {TransactionRequest} from '../../TransactionRequest';
import {VechainExecutableContractCall} from "./VechainExecutableContractCall";

export class VechainContractCallExecutionRequest extends TransactionRequest {
    public blockRef?: string;
    public chainTag?: string;
    public expiration: number = 0;
    public gas!: number;
    public gasPriceCoef!: number;
    public nonce?: string;
    public contractCalls: VechainExecutableContractCall[] = [];
}
