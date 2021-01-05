import { SecretType } from '../SecretType';
import { WalletType } from './Wallet';

export interface NFT {
    id: string;
    tokenId?: string;
    owner: string;
    name?: string;
    description?: string;
    url?: string;
    backgroundColor?: string;
    imageUrl?: string;
    imagePreviewUrl?: string;
    imageThumbnailUrl?: string;
    attributes?: Trait[];
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

export interface Trait {
    traitType?: string;
    value?: string;
    displayType?: string;
    traitCount?: string;
}

export interface WalletItems {
    walletId: string;
    walletAddress: string;
    walletType: WalletType;
    secretType: SecretType;
    items: NFT[];
}
