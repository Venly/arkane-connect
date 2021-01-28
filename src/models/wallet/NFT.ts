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
    animationUrl?: string;
    fungible?: boolean;
    contract: NFTContract;
}

export interface NFTContract {
    name?: string;
    description?: string;
    address: string;
    symbol?: string;
    url?: string;
    imageUrl?: string;
    type?: string;
    media?: string;
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
