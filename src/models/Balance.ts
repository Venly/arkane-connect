import {SecretType} from './SecretType';

export class Balance {

    public chainType!: SecretType;
    public balance!: number;
    public gasBalance!: number;
    public rawBalance!: string;
    public rawGasBalance!: string;
}
