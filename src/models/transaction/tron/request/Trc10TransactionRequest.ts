import { TransactionRequest } from '../../TransactionRequest';

export class Trc10TransactionRequest extends TransactionRequest {
    public value!: number;
    public token!: string;
    public to!: string;
}
