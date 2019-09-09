import {TransactionRequest} from '../../TransactionRequest';
import {EthereumExecutableContractCall} from "./EthereumExecutableContractCall";

export class EthereumContractCallExecutionRequest extends TransactionRequest {
    public blockRef?: string;
    public chainTag?: string;
    public expiration: number = 0;
    public gas!: number;
    public gasPriceCoef!: number;
    public nonce?: string;
    public contractCalls: EthereumExecutableContractCall[] = [];
}
