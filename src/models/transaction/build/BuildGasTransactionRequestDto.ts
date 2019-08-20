import { BuildTransactionRequestBaseDto } from './BuildTransactionRequestBaseDto';

export class BuildGasTransactionRequestDto extends BuildTransactionRequestBaseDto {
    public value!: number;
}
