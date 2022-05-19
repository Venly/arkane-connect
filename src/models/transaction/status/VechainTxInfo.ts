import { RestApiResponseTxStatus } from './RestApiResponseTxStatus';

export interface VechainTxInfo extends RestApiResponseTxStatus{
    nonce: string;
    gas: number;
    gasUsed: number;
    gasPriceCoef: number;
    outputs: VechainReceiptOutput[];
}

export interface VechainTxTransfer{
    sender: string;
    recipient: string;
    amount: string;
}

export interface VechainTxEvent{
    address: string;
    topics: string[];
    data: string;
}

export interface VechainReceiptOutput{
    contractAddress: string;
    transfers: VechainTxTransfer[];
    events: VechainTxEvent[];
}
