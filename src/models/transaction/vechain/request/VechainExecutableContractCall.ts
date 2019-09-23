
export interface VechainContractCallInput {
    type: string;
    value: string;
}

export class VechainExecutableContractCall {
    public to!: string;
    public amount!: number;
    public functionName!: string;
    public inputs: VechainContractCallInput[] = [];
}
