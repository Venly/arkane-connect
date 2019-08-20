import { BuildTransactionRequestBaseDto } from './BuildTransactionRequestBaseDto';

export class BuildSimpleTransactionRequestDto extends BuildTransactionRequestBaseDto {
    public value?: number;
    public data?: string;
}
