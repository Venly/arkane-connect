import { ContractCallInputDto } from './ContractCallInputDto';

export class ContractCallInput {
    public type!: string;
    public value!: any;

    public static fromData(data: ContractCallInputDto): ContractCallInput {
        const {type, value} = data;
        return new this(type, value);
    }

    constructor(type: string,
                value: any) {
        this.type = type;
        this.value = value;
    }
}
