import { BuildTransactionRequestBaseDto } from './BuildTransactionRequestBaseDto';

export class BuildTokenTransactionRequestDto extends BuildTransactionRequestBaseDto {
    public value!: number;
    public tokenAddress!: string;
}
