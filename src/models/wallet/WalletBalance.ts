import {SecretType} from '../SecretType';

export class WalletBalance {
    public secretType?: SecretType; // needs to change in API to secretType
    public balance!: number;
    public symbol!: string;
    public gasBalance!: number;
    public gasSymbol!: string;
    public rawBalance!: string;
    public rawGasBalance!: string;
    public decimals!: number;
}
