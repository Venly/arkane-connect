import {SecretType} from './SecretType';

export interface CreateWalletCommand {
    alias?: string;
    pincode?: string;
    description?: string;
    primary?: boolean;
    hasCustomPin?: boolean;
    secretType: SecretType;
    clients?: string[];
}

export interface LinkWalletCommand {
    client: string;
    walletIds: number[];
}
