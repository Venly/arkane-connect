import { TxStatus } from '../TxStatus';

export interface RestApiResponseTxStatus {
    hash: string;
    status: TxStatus;
    confirmations: number;
    blockHash: string;
    blockNumber: number;
    hasReachedFinality: boolean;
}
