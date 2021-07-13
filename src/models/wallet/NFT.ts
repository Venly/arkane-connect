import { SecretType } from '../SecretType';
import { WalletType } from './Wallet';

export interface NFT {
    id: string;
    name?: string;
    description?: string;
    url?: string;
    backgroundColor?: string;
    imageUrl?: string;
    imagePreviewUrl?: string;
    imageThumbnailUrl?: string;
    attributes?: Attribute[];
    animationUrls?: TypeValue[];
    fungible?: boolean;
    maxSupply?: number;
    contract: NFTContract;
    balance: number;
}

export interface NFTContract {
    name?: string;
    description?: string;
    address: string;
    symbol?: string;
    url?: string;
    imageUrl?: string;
    type?: string;
    media?: TypeValue[];
    verified?: boolean;
    premium?: boolean;
    categories?: string[];
}

export interface Attribute {
    type?: string;
    name?: string;
    value?: string;
    maxValue?: number;
}

export interface WalletItems {
    walletId: string;
    walletAddress: string;
    walletType: WalletType;
    secretType: SecretType;
    items: NFT[];
}

export interface TypeValue {
    type: string;
    value: string;
}
