import { RestApiResponseTxStatus } from './RestApiResponseTxStatus';

export interface EvmTxInfo extends RestApiResponseTxStatus{
    nonce: number;
    gas: number;
    gasUsed: number;
    gasPrice: number;
    logs: EvmTxLog[];
    from: string;
    to: string;
}

export interface EvmTxLog{
    logIndex: number;
    data: string;
    type: string;
    topics: string[];
}
