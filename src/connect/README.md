Arkane Connect
===

# Creating a new ArkaneConnect instance
## Constructor
```javascript
new ArkaneConnect(<clientID>, <bearerTokenProvider>[, <environment*>]);
```

| Parameter | Description | Example |
|-----------|-------------|---------|
| clientID | The clientID | `'Arkane'`|
| bearerTokenProvider | A function returning the bearer token to login to Arkane | `() => auth.token`|
| environment | The environment you want to connect to, possible values are *local*, *tst1*, *staging*, *prod*. When omitted, `'prod'` will be used | `'local'` |

## init
After calling the constructor, another function needs to be called: 
```javascript
arkaneConnect.init(<chain>)
``` 
(returns a `Promise`) 

| Parameter | Description | Example |
|-----------|-------------|---------|
| chain | The chain for which you want to check there is at least one wallet present | `'Ethereum'`, `'VeChain'`|

This call makes sure that the user has an Arkane master pincode and at least one wallet necessary for the third party app.
 
## Example
Below you can find a full example of how setting up ArkaneConnect might look like:
```javascript
const arkaneConnect = new ArkaneConnect('Arkane', () => 'iamabearertoken');
arkaneConnect.init('Ethereum').then(function () { ... })
                              .catch(function() { ... });
```
# Get Wallets

```javascript
arkaneConnect.getWallets().then(function(result) {
    console.log(result);
})
```

# Signing Transactions
```javascript
arkaneConnect.signTransaction(<TransactionData>).then(function(result) {
                                                    console.log(result);
                                                }).catch(function(error) {
                                                    console.log(error);
                                                });;
``` 

### (Optional) initialize popup
If the popup blocker of the browser is triggered (this might happen if you call a different api before calling the 'signTransaction'), please call the 'initializeTransaction' first.
This will open the popup for the signature already and redirect the popup to the correct page when signature is needed.

 
```javascript
arkaneConnect.initPopup();

//custom logic

arkaneConnect.signTransaction(<TransactionData>);
```

## Signing a Ethereum Transaction


```javascript
arkaneConnect.signTransaction({
    type: 'ETHEREUM_TRANSACTION',
    walletId: 44,
    submit: false,
    gasPrice: 10000000000,
    gas: 23000,
    nonce: 0,
    value: 10000000000,
    data: '0x',
    to: '0xdc71b72db51e227e65a45004ab2798d31e8934c9'
});
```

## Signing a VeChain Transaction

```javascript
arkaneConnect.signTransaction({
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
});
```
