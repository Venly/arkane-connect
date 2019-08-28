import { BuildTransferRequestBaseDto } from './BuildTransferRequestBaseDto';

export class BuildTransferRequestDto extends BuildTransferRequestBaseDto {
    public value?: number;
    public data?: string;
}
