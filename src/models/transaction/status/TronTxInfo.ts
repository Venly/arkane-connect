import { RestApiResponseTxStatus } from './RestApiResponseTxStatus';

export interface TronTxInfo extends RestApiResponseTxStatus{
    contracts: any[];
    id: string;
    fee: number;
    contractResult: string[];
    contractAddress: string[];
    receipt: TronReceipt;
    log: TronLog;
    result: number;
    resMessage: string;
    assetIssueID: any;
    withdrawAmount: number;
    unfreezeAmount: number;
    internalTransactions: TronInternalTransaction[];
    exchangeReceivedAmount: number;
    exchangeInjectAnotherAmount: number;
    exchangeWithdrawAnotherAmount: number;
    exchangeId: number;
}

export interface TronReceipt{
    energyUsage: number;
    energyFee: number;
    originEnergyUsage: number;
    energyUsageTotal: number;
    netUsage: number;
    netFee: number;
    result: string;
}

export interface TronLog{
    address: string;
    topics: string[];
    data: string;
}

export interface TronCallValueInfo{
    callValue: number;
    tokenId: any;
}

export interface TronInternalTransaction{
    callerAddress: string;
    transferToAddress: string;
    callValueInfo: TronCallValueInfo[];
    note: string;
    rejected: boolean;
}
