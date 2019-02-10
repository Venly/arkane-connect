import { ArkaneConnect }             from './connect/connect';

export { ArkaneConnect }                                                    from './connect/connect';
export { Signer, SignMethod, SignerResult }                                 from './signer/Signer';
export { PopupSigner }                                                      from './signer/PopupSigner';
export { RedirectSigner }                                                   from './signer/RedirectSigner';
export { Api }                                                              from './api/Api';
export { SecretType }                                                       from './models/SecretType';
export { Wallet }                                                           from './models/wallet/Wallet';
export { Profile }                                                          from './models/profile/Profile';
export { GenericTransactionRequest }                                        from './models/transaction/GenericTransactionRequest';
export { TransactionRequest }                                               from './models/transaction/TransactionRequest';
export { EthereumErc20TransactionRequest }                                  from './models/transaction/ethereum/request/EthereumErc20TransactionRequest';
export { EthereumTransactionRequest }                                       from './models/transaction/ethereum/request/EthereumTransactionRequest';
export { VechainTransactionRequest, VechainTransactionRequestClause }       from './models/transaction/vechain/request/VechainTransactionRequest';
export { VechainVip180TransactionRequest, VechainVip180TransactionClause }  from './models/transaction/vechain/request/VechainVip180TransactionRequest';
export { BitcoinTransactionRequest }                                        from './models/transaction/bitcoin/request/BitcoinTransactionRequest';
export { LitecoinTransactionRequest }                                       from './models/transaction/litecoin/request/LitecoinTransactionRequest';
export { WalletBalance }                                                    from './models/wallet/WalletBalance';
export { TokenBalance }                                                     from './models/wallet/TokenBalance';
export { TransactionResult }                                                from './models/transaction/TransactionResult';

if (typeof window !== 'undefined') {
    (window as any).ArkaneConnect = ArkaneConnect;
}   