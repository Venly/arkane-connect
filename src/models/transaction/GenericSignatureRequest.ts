import { SignatureRequestType } from '../SignatureRequestType';
import { Network }              from '../Network';

export interface GenericSignatureRequest {
    walletId: string
    type: SignatureRequestType;
    data?: string;
    hash?: boolean;
    prefix?: boolean;
    network?: Network;

    [key: string]: any;
}