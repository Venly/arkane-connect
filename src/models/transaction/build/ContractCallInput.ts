import { ContractCallInputDto } from './ContractCallInputDto';

export class ContractCallInput {
    public type!: string;
    public value!: string;

    public static fromData(data: ContractCallInputDto): ContractCallInput {
        const {type, value} = data;
        return new this(type, value);
    }

    constructor(type: string, value: string) {
        this.type = type;
        this.value = value;
    }
}
