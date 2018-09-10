import {SecretType} from '@/models/SecretType';

export interface CreateWalletCommand {
    alias?: string;
    pincode?: string;
    description?: string;
    primary?: boolean;
    masterPincode?: string;
    secretType: SecretType;
    clients?: string[];
}

export interface LinkWalletCommand {
    issuer: string;
    walletIds: number[];
}
