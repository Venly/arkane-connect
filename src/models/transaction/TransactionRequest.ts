import { Network } from '../Network';

export abstract class TransactionRequest {
    public id?: string;
    public type!: string;
    public walletId!: string;
    public pincode!: string;
    public network?: Network;
}
