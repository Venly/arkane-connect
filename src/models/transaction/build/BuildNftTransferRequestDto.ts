import { BuildTransferRequestBaseDto } from './BuildTransferRequestBaseDto';

export class BuildNftTransferRequestDto extends BuildTransferRequestBaseDto {
    public tokenAddress!: string;
    public tokenId!: string;
    public from?: string;
    public amount?: number;
}
