import { BuildTransactionRequestBaseData } from './BuildTransactionRequestBaseData';

export class BuildTokenTransactionRequestData extends BuildTransactionRequestBaseData {
    public value!: number;
    public tokenAddress!: string;
}
