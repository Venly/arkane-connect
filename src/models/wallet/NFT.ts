import { SecretType } from '../SecretType';

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
    secretType: SecretType;
    items: NFT[];
}
