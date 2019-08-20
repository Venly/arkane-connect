import { BuildTransactionRequestBaseDto } from './BuildTransactionRequestBaseDto';

export class BuildTransactionRequestDto extends BuildTransactionRequestBaseDto {
    public value?: number;
    public tokenAddress?: string;
    public data?: string;
    public from?: string;
    public tokenId?: string;
}
