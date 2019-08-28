import { BuildTransferRequestBaseDto } from './BuildTransferRequestBaseDto';

export class BuildGenericTransferRequestDto extends BuildTransferRequestBaseDto {
    public value?: number;
    public tokenAddress?: string;
    public data?: string;
    public from?: string;
    public tokenId?: string;
}
