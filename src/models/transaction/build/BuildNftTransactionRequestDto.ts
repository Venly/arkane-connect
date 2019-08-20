import { BuildTransactionRequestBaseDto } from './BuildTransactionRequestBaseDto';

export class BuildNftTransactionRequestDto extends BuildTransactionRequestBaseDto {
    public tokenAddress!: string;
    public tokenId!: string;
    public from?: string;
}
