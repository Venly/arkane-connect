export interface EthereumContractCallInput {
    type: string;
    value: string;
}

export class EthereumExecutableContractCall {
    public contractAddress!: string;
    public amount!: number;
    public functionName!: string;
    public inputs: EthereumContractCallInput[] = [];
}
