import { RestApiResponseTxStatus } from './RestApiResponseTxStatus';

export interface HederaTxInfo extends RestApiResponseTxStatus{
    chargedTxFee: string;
    consensusTimestamp: string;
    entityId: string;
    maxFee: string;
    memoBase64: string;
    name: string;
    node: string;
    scheduled: boolean;
    transactionId: string;
    validDurationSeconds: string;
    validStartTimestamp: string;
    result: string;
    transfers: HederaTransfer[];
    tokenTransfers: HederaTokenTransfer[];
}

export interface HederaTransfer{
    account: string;
    amount: number;
}

export interface HederaTokenTransfer{
    tokenId: string;
    account: string;
    amount: number;
}
