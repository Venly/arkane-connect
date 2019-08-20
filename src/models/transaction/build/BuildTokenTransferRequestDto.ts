import { BuildTransferRequestBaseDto } from './BuildTransferRequestBaseDto';

export class BuildTokenTransferRequestDto extends BuildTransferRequestBaseDto {
    public value!: number;
    public tokenAddress!: string;
}
