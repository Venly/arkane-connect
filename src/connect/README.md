Arkane Connect
===

# Integrating Arkane Connect in your application

To integrate Arkane Connect in your web application, first of all you will need to [create a new ArkaneConnect instance](#Constructor). Secondly you will need to provide the 
instance with a way to authenticate. For this there are two options:
1) You use the authentication provider baked into Arkane
2) You initialize Arkane Connect providing it with your own bearer token provider


## Constructor
```javascript
new ArkaneConnect(clientID:string, options?: { environment?: string, signMethod?: string, bearerTokenProvider?: () => string});
```

| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| clientID | true | The clientID (case sensitive)| `'Arkane'`|
| options | false | An object containing the options you want to pass to Arkane Connect | |

Allowed `options` are:

| Option | Required | Description | Example |
|-----------|----------|-------------|---------|
| environment | false (default = `'prod'`) | The environment to which you want to connect, possible values are `'local'`, `'tst1'`, `'staging'`, `'prod'` | `'local'` |
| signMethod | false (default = `'POPUP'`) | The sign method you to use, possible values are `'POPUP'` or `'REDIRECT'` | `'REDIRECT'` |
| bearerTokenProvider | false (default = the baked in authentication of Arkane Connect is used) | You can implement all the authentication handling yourself, you then need to do provide Arkane Connect with your own bearer token provider. This is a function returning the bearer token to login to Arkane. | `() => auth.token`|

e.g.
```javascript
// production + sign transactions using the POPUP method + authentication using Arkane Connect
new ArkaneConnect('Arketype');

// production + sign transactions using the REDIRECT method + authentication using Arkane Connect
new ArkaneConnect('Arketype', { signMethod: 'REDIRECT' });

// staging + sign transactions using the REDIRECT method + authentication using bearerTokenProvider supplied by the client
new ArkaneConnect('Arketype', { environment: 'staging', signMethod: 'REDIRECT' , bearerTokenProvider: () => auth.token});
```


## Authentication using Arkane Connect
Following methods allow you to do and manage authentication with Arkane Connect

### Check if a user is authenticated
```javascript
arkaneConnect.checkAuthenticated(options?: { redirectUri?: string });
```
(returns a `Promise<AuthenticationResult>`)

This will redirect the current page to our authentication provider. There it will check if the user is already authenticated and then redirect back to `options.redirectUri` with 
an authentication token. This token will contain a bearer + refresh token if authenticated, or will be empty if not authenticated.

\* `options` and `options.redirectUri` are optional. If you omit them, the uri of the current page will be used instead.

e.g.

```javascript
// Redirect to the current page
arkaneConnect.checkAuthenticated();

// Redirect to https://arkane.network
arkaneConnect.checkAuthenticated({ redirectUri: 'https://arkane.network'});
```

### Authenticate a user
```javascript
arkaneConnect.authenticate(options?: { redirectUri?: string });
```
(returns a `Promise<AuthenticationResult>`)

This will redirect the current page to our authentication provider. There it will check if the user is already authenticated and if not, show a login page and allow the 
user to log in. After this, it will redirect back to `options.redirectUri` with an authentication token containing a bearer + refresh token.

\* `options` and `options.redirectUri` are optional. If you omit them, the uri of the current page will be used instead.
e.g.

```javascript
// Redirect to the current page
arkaneConnect.authenticate();

// Redirect to https://arkane.network
arkaneConnect.authenticate({ redirectUri: 'https://arkane.network'});
```

#### AuthenticationResult
```javascript
{
    authenticated: (auth) => {};
    notAuthenticated: (auth) => {};
}
```
AuthenticationResult contains two functions `authenticated` and `notAuthenticated` which you can supply with callback functions to handle both situations.

e.g.
```javascript
arkaneConnect.checkAuthenticated()
             .then((result) => result.authenticated((auth) => {
                                        console.log('Authentication successfull ' + auth.subject);
                                     })
                                     .notAuthenticated((auth) => {
                                        console.log('Not authenticated');
                                     })
             );
```    

### Log a user out
```javascript
arkaneConnect.logout();
```
(returns `void`)

### Receive a callback when the bearer token refreshes
```javascript
arkaneConnect.addOnTokenRefreshCallback(bearerToken => {<process the token>});
```   
This function has one parameter: a callback function accepting one parameter (the new bearer token) and returning `void` 

e.g.
```javascript
arkaneConnect.addOnTokenRefreshCallback(bearerToken => {
    console.log('The bearer token has been refreshed: ' + bearerToken);
});
```
 
## Full integration example
Below you can find a full example of how setting up Arkane Connect might look like. We also made an [example project](https://github.com/ArkaneNetwork/Arketype) as a more 
complete example. 
```javascript
const arkaneConnect = new ArkaneConnect('Arketype');
arkaneConnect.checkAuthenticated()
             .then((result) => result.authenticated((auth) => { /* Authenticated */  })
                                     .notAuthenticated((auth) => {
                                         /* Not authenticated */
                                         arkaneConnect.authenticate() 
                                     }));
```
# Using Arkane Connect
##Get Wallets

```javascript
arkaneConnect.getWallets();
```
Returns `Promise<Wallet[]>`, where the defenition of `Wallet` is:
```javascript
{
    id: string,
    address: string,
    secretType: 'ETHEREUM' | 'VECHAIN',
    funds: {
        name: string,
        amount: number
    }
    lastUpdated: number,
    createdAt: string,
    alias: string,
    description: string,
    archived: boolean,
    primary: boolean,
    balance: {
        chainType: 'ETHEREUM' | 'VECHAIN',
        balance: number,
        gasBalance: number,
        rawBalance: string,
        rawGasBalance: string
    }
}
``` 

## Manage wallets
```javascript
arkaneConnect.manageWallets(chain: 'ETHEREUM' | 'VECHAIN');
```
Calling this function will redirect the user to a page where he can mange the wallets (of the specified chain) linked to your application

## Get Profile
```javascript
arkaneConnect.getProfile();
``` 
returns `Promise<Profile>`, where the defenition of `Profile` is:
```javascript
{
    userId: string,
    hasMasterPin: boolean,
    username: string,
    email: string,
    firstName: string,
    lastName: string
}
```

## Executing Transactions
### Creating a signer
To execute a transaction, you first need to create a signer: 
```javascript
const signer  = arkaneConnect.createSigner(signUsing?: 'POPUP' | 'REDIRECT');
```

| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| signUsing | no (default = the method supplied in the constructor, 'POPUP' if none was passed) | The sign method you want to use. This parameter acts as an override of the one you supplied in the constructor.| `'REDIRECT'`|


In case signUsing = 'POPUP', creating the signer will open a popup that starts listening for a transactionRequest.  


#### WARNING

If signUsing = 'POPUP' and you are executing a transaction as reaction to an event (e.g. a button click), call `arkaneConnect.createSigner()` as very first in your event handling, otherwise the popup might get blocked by the popup blocker of the browser.  

#### Closing the signer (If signUsing = 'POPUP')

```javascript
if (arkaneConnect.isPopupSigner(signer)) {
    signer.closePopup();
}
```
If you want to close the signer popup manually (e.g. if something goes wrong between opening it and submitting the transactionRequest), you can use above function to close it. 
The type guard around it (`if (arkaneConnect.isPopupSigner(signer)) {...}`), isn't mandatory, but it makes your code more robust.

### Executing a transaction
```javascript
signer.executeTransaction(transactionRequest: GenericTransactionRequest);
```
(returns `Promise<SignerResult>`)

Executing a transaction can be done by calling the `executeTransaction(...)` function on the signer. 

* **If signUsing = 'POPUP':** This will send the transaction request to the popup and show the signer
* **If signUsing = 'REDIRECT':** This will redirect the user to the signer 

#### GenericTransactionRequest
```javascript
{
    walletId: string;
    to: string;
    value: number;
    secretType: 'ETHEREUM' | 'VECHAIN'; 
    tokenAddress?: string;
}
```
| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| walletId | yes | The **Arkane ID** of the wallet you want transfer out of. This ID is returned when calling `getWallets()` and can also be found in the URL of https://arkane.network/chains/ethereum/wallets/**71dec640-4eb8-4321-adb8-b79461573fc4**/ | `'71dec640-4eb8-4321-adb8-b79461573fc4'`|
| to | yes | The address of the wallet you want to transfer to | `'0xE51551D3B11eF7559164D051D9714E59A1c4E486'`|
| value | yes | The amount of tokens you want to transfer (decimal value) | `3.14159265359`|
| secretType | yes | The type of blockchain you want to do the transaction on | `'ETHEREUM'`|
| tokenAddress | no | The address of the token you want to use.  | `'0x4DF47B4969B2911C966506E3592c41389493953b'`|

#### SignerResult
```javascript
{
    status: 'SUCCESS' | 'ABORTED' | 'ERROR',
    result?: {transactionHash: string},
    errors?: []
}
```
| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| status | yes | The status of the transaction. `'ABORTED'` means that the user has closed the popup or clicked the back to _\<app\>_ link | `'SUCCESS`|
| result | no, only when status `'SUCCESS'` | An object containing the transaction hash of the executed transaction | `'0x4b4c1e2d836dc31ad27fc54fed4d7dbabd41aa1b070fb8c437f5beffb1d5d7b7`|
| errors | no, only when status `'ABORTED'` or `'ERROR'` | An array containing the errors of the transaction that you tried to execute | |


### Full example
```javascript
const signer = arkaneConnect.createSigner();

signer.executeTransaction({
    walletId: '71dec640-4eb8-4321-adb8-b79461573fc4',
    to: '0xf147cA0b981C0CD0955D1323DB9980F4B43e9FED',
    value: 3.14159265359,
    secretType: 'ETHEREUM',
}).then((result) => {
   if (result.success) {
       console.log(`Transaction ${result.result.transactionHash} has been successfully executed!`);
   } else {
       console.warn(`Something went wrong while executing the transaction`);
   }
}).catch((reason) => {
    console.log(error);
});
```

### Building a transaction request
Because the transaction requests are very chain specific, we distilled a simplified transaction request which you can use to build the chain specific transaction request.

```javascript
arkaneConnect.buildTransactionRequest({
    walletId: string,                   // The id of the wallet to be used as 'from'
    to: string,                         // The Ethereum address to send the amount to
    value: number,                      // Amount to transfer in decimals
    secretType: 'ETHEREUM' | 'VECHAIN', // The chain on which you want to execute the transaction 
    tokenAddress?: string               // If omitted, the standard token (e.g. ETH, VET) of the supplied secretType will be used 
});
```
(returns `Promise<TransactionRequest>`) 

You can use this as follows to build and execute a transaction:
```javascript
const signer = arkaneConnect.createSigner();

arkaneConnect.buildTransactionRequest({
    walletId: '7368b9b0-45b4-4087-8886-2e66fe99f923',
    secretType: 'ETHEREUM',
    to: "0x680800Dd4913021821A9C08D569eF4338dB8E9f6",
    value: 0.0314
})
.then((transactionRequest) => {
    
    signer.executeTransaction(transactionRequest)
          .then(function(result) {
              if (result.success) {
                 console.log(`Transaction ${result.result.transactionHash} has been successfully executed!`);
              } else {
                 console.warn(`Something went wrong while executing the transaction`);
              }
          })
          .catch(function(error) {
              console.error(error);
          });
    
})
.catch((error) => {
    // Always catch errors and close the signer, otherwise it looks like the initialising popup is hanging when something goes wrong
    signer.close();
    console.error(error);
});
``` 

### Transaction Requests
#### A Ethereum (ETH) Transaction Request
```javascript
{
    type: 'ETH_TRANSACTION',
    walletId: string,       // The id of the wallet to be used as 'from'
    gasPrice?: number,      // The gas price in wei. If omitted, a gas estimator will be used. There is also a possibility to adjust this in the signer.    
    gas?: number,           // The gas limit. If omitted, a gas estimator will be used. There is also a possibility to adjust this in the signer.
    nonce?: number,         // The nonce. If omitted, it will be automatically filled.
    value: number,          // The amount of ETH in wei 
    to: string,             // The Ethereum address to send the amount to
    data?: string           // The data. If omitted, '0x' will be used
}
```

#### A Ethereum ERC20 Transaction Request
```javascript
{
    type: 'ETHEREUM_ERC20_TRANSACTION',
    walletId: string,       // The id of the wallet to be used as 'from'
    gasPrice?: number,      // The gas price in wei. If omitted, a gas estimator will be used. There is also a possibility to adjust this in the signer.    
    gas?: number,           // The gas limit. If omitted, a gas estimator will be used. There is also a possibility to adjust this in the signer.
    nonce?: number,         // The nonce. If omitted, it will be automatically filled.
    value: number,          // The amount of ETH in wei 
    to: string,             // The Ethereum address to send the amount to
    tokenAddress: string    // The address of the ERC20 token
}
```

#### A VeChain (VET) Transaction Request
```javascript
{
    type: 'VET_TRANSACTION',
    walletId: string,       // The id of the wallet to be used as 'from'
    blockRef?: string,      // The blockRef
    chainTag?: string,      // The chainTag
    expiration?: number,    // The expiration
    gas?: number,           // The gas limit. If omitted, a gas estimator will be used. There is also a possibility to adjust this in the signer.
    gasPriceCoef?: number,  // The gas price coeficient. If omitted, 0 will be used. There is also a possibility to adjust this in the signer.
    nonce?: number,         // The nonce. If omitted, it will be automatically filled.
    clauses: [{             // the clauses to execute in this transaction     
        to: string,         // The VeChain address to send the amount to
        amount: number,     // The amount of VET in wei 
        data?: string       // The data. If omitted, '0x' will be used
    }]
}
```

#### A VeChain VTHO Transaction Request
```javascript
{
    type: 'VTHO_TRANSACTION',
    walletId: string,       // The id of the wallet to be used as 'from'
    blockRef?: string,      // The blockRef
    chainTag?: string,      // The chainTag
    expiration?: number,    // The expiration
    gas?: number,           // The gas limit. If omitted, a gas estimator will be used. There is also a possibility to adjust this in the signer.
    gasPriceCoef?: number,  // The gas price coeficient. If omitted, 0 will be used. There is also a possibility to adjust this in the signer.
    nonce?: number,         // The nonce. If omitted, it will be automatically filled.
    clauses: [{             // the clauses to execute in this transaction     
        to: string,         // The VeChain address to send the amount to
        amount: number      // The amount of VET in wei 
    }]
}
```

#### A VeChain VIP180 Transaction Request
```javascript
{
    type: 'VECHAIN_VIP180_TRANSACTION',
    walletId: string,           // The id of the wallet to be used as 'from'
    blockRef?: string,          // The blockRef
    chainTag?: string,          // The chainTag
    expiration?: number,        // The expiration
    gas?: number,               // The gas limit. If omitted, a gas estimator will be used. There is also a possibility to adjust this in the signer.
    gasPriceCoef?: number,      // The gas price coeficient. If omitted, 0 will be used. There is also a possibility to adjust this in the signer.
    nonce?: number,             // The nonce. If omitted, it will be automatically filled.
    clauses: [{                 // the clauses to execute in this transaction     
        to: string,             // The VeChain address to send the amount to
        amount: number,         // The amount of VET in wei 
        tokenAddress: string    // The address of the VIP180 token
    }]
}
```

### More examples
For more examples on how to use Arkane Connect, make sure to checkout our example project on GitHub: https://github.com/ArkaneNetwork/Arketype