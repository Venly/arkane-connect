import { SignatureRequestType } from '../SignatureRequestType';

export interface GenericSignatureRequest {
    walletId: string
    type: SignatureRequestType;
    data?: string;
    hash?: boolean;
    prefix?: boolean;

    [key: string]: any;
}