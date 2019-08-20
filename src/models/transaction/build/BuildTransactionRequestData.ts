import { BuildTransactionRequestBaseData } from './BuildTransactionRequestBaseData';

export class BuildTransactionRequestData extends BuildTransactionRequestBaseData {
    public value?: number;
    public tokenAddress?: string;
    public data?: string;
    public from?: string;
    public tokenId?: string;
}
