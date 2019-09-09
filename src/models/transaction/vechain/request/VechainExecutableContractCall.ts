
export interface VechainContractCallInput {
    type: string;
    value: string;
}

export class VechainExecutableContractCall {
    public contractAddress!: string;
    public amount!: number;
    public functionName!: string;
    public inputs: VechainContractCallInput[] = [];
}
