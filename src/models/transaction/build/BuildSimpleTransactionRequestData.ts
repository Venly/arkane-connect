import { BuildTransactionRequestBaseData } from './BuildTransactionRequestBaseData';

export class BuildSimpleTransactionRequestData extends BuildTransactionRequestBaseData {
    public value?: number;
    public data?: string;
}
