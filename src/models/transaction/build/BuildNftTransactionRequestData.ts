import { BuildTransactionRequestBaseData } from './BuildTransactionRequestBaseData';

export class BuildNftTransactionRequestData extends BuildTransactionRequestBaseData {
    public tokenAddress!: string;
    public tokenId!: string;
    public from?: string;
}
