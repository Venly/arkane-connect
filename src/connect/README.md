Arkane Connect
===

# Create a new ArkaneConnect instance

```javascript
new ArkaneConnect(<clientID>, <chain>, <bearerToken>[, <environment*>]);
```

\* Possible values are *local*, *tst1*, *staging*, *prod*

e.g.
```javascript
const arkaneConnect = new ArkaneConnect('Arkane', 'VeChain', 'iamabearertoken');
```

# Get Wallets

```
arkaneConnect.getWallets().then(function(result) {
        console.log(result);
    })
```

# Signing an Ethereum Transaction

```
arkaneConnect.signEthereumTransaction({
            type: 'ETHEREUM_TRANSACTION',
            walletId: 44,
            submit: false,
            gasPrice: 10000000000,
            gas: 23000,
            nonce: 0,
            value: 10000000000,
            data: '0x',
            to: '0xdc71b72db51e227e65a45004ab2798d31e8934c9'
        }).then(function(result) {
            console.log(result);
        }).catch(function(error) {
            console.log(error);
        });
```

# Signing a VeChain Transaction

```
arkaneConnect.signVechainTransaction({
            type: 'VECHAIN_TRANSACTION',
            walletId: 44,
            submit: false,
            blockRef : "0x1",
            chainTag : "0x2",
            expiration : 10,
            gas: 23000,
            gasPriceCoef : 0,
            nonce: 0,
            clauses: [{
                to: '0xdc71b72db51e227e65a45004ab2798d31e8934c9',
                amount : "10000",
                data: '0x0',
            }]
        }).then(function(result) {
            console.log(result);
        }).catch(function(error) {
            console.log(error);
        });
```
