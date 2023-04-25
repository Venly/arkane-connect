import { VenlyConnect } from './connect/connect';

export * from './api/Api';
export * from './api/ResponseBody';

export * from './connect/connect';

export * from './models/Account';
export * from './models/ConfirmationRequest';
export * from './models/ConfirmationRequestType';
export * from './models/Network';
export * from './models/RequestDataType';
export * from './models/SecretType';
export * from './models/SignatureRequestType';
export * from './models/TransactionRequestType';
export * from './models/WindowMode';

export * from './models/contract/ContractReadRequest';
export * from './models/contract/ContractReadRequestInputParam';
export * from './models/contract/ContractReadRequestOutputParam';
export * from './models/contract/ContractReadResult';

export * from './models/profile/Profile';

export * from './models/transaction/GenericSignatureRequest';
export * from './models/transaction/TransactionRequest';
export * from './models/transaction/TransactionResult';
export * from './models/transaction/TxStatus';

export * from './models/transaction/build/BuildTransactionRequest';
export * from './models/transaction/build/BuildContractExecutionRequestDto';

export * from './models/transaction/ethereum/request/EthereumContractCallExecutionRequest';
export * from './models/transaction/ethereum/request/EthereumErc20TransactionRequest';
export * from './models/transaction/ethereum/request/EthereumErc721TransactionRequest';
export * from './models/transaction/ethereum/request/EthereumErcTokenTransactionRequest';
export * from './models/transaction/ethereum/request/EthereumTransactionRequest';

export * from './models/transaction/gochain/request/GochainErc20TransactionRequest';
export * from './models/transaction/gochain/request/GochainTransactionRequest';

export * from './models/transaction/matic/request/MaticContractCallExecutionRequest';
export * from './models/transaction/matic/request/MaticErc20TransactionRequest';
export * from './models/transaction/matic/request/MaticErc721TransactionRequest';
export * from './models/transaction/matic/request/MaticErcTokenTransactionRequest';
export * from './models/transaction/matic/request/MaticTransactionRequest';

export * from './models/transaction/tron/request/TronContractCallExecutionRequest';
export * from './models/transaction/tron/request/TronTransactionRequest';

export * from './models/transaction/vechain/request/VechainContractCallExecutionRequest';
export * from './models/transaction/vechain/request/VechainExecutableContractCall';
export * from './models/transaction/vechain/request/VechainTransactionRequest';
export * from './models/transaction/vechain/request/VechainVip180TransactionRequest';

export * from './models/transaction/bitcoin/request/BitcoinTransactionRequest';
export * from './models/transaction/litecoin/request/LitecoinTransactionRequest';

export * from './models/wallet/CreateApplicationWalletRequest';
export * from './models/wallet/CreateFirstWalletRequest';
export * from './models/wallet/CreateWalletRequest';
export * from './models/wallet/ImportWalletRequest';
export * from './models/wallet/NFT';
export * from './models/wallet/TokenBalance';
export * from './models/wallet/Wallet';
export * from './models/wallet/WalletBalance';

export * from './popup/PopupActions';
export * from './popup/PopupResult';

export * from './signer/PopupSigner';
export * from './signer/RedirectSigner';
export * from './signer/Signer';

export * from './types/EventTypes';

if (typeof window !== 'undefined') {
    (window as any).VenlyConnect = VenlyConnect;
}
