Arkane Connect
===

# Integrating Arkane Connect in your application

To integrate Arkane Connect in your web application, first of all you will need to [create a new ArkaneConnect instance](#Constructor). Secondly you will need to provide the 
instance with a way to authenticate. For this there are two options:
1) You use the authentication provider baked into Arkane
2) You initialize Arkane Connect providing it with your own bearer token provider


## Constructor
```javascript
new Arkane.Connect(clientID:string, options?: { chains?: string[], environment?: string, signMethod?: Arkane.SignMethod});
```

| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| clientID | true | The clientID (case sensitive)| `'Arkane'`|
| options | false | An object containing the options you want to pass to Arkane Connect | |

Allowed `options` are:

| Option | Required | Description | Example |
|-----------|----------|-------------|---------|
| chains | false | An array containing the chains to which you want to restrict this application (for now, only one restricted chain is supported)| `['Ethereum', 'VeChain']`|
| environment | false (default = `'prod'`) | The environment to which you want to connect, possible values are `'local'`, `'tst1'`, `'staging'`, `'prod'` | `'local'` |
| signMethod | false (default = `SignMethod.POPUP`) | The sign method you to use, possible values are `SignMethod.POPUP` or `SignMethod.REDIRECT` | `SignMethod.REDIRECT` |

e.g.
```javascript
// production + no mandatory wallets
new ArkaneConnect('Arketype');

// production + mandatory Ethereum wallet
new ArkaneConnect('Arketype', { chains: ['Ethereum'] });

// staging + mandatory Ethereum wallet
new ArkaneConnect('Arketype', { chains: ['Ethereum'], environment: 'staging' });
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

## Init
You can also implement all the authentication handling yourself. What you then need to do is provide Arkane Connect with your own bearer token provider. 
This can be done through the `init` method.
 
```javascript
arkaneConnect.init(<bearerTokenProvider>);
``` 
(returns a `Promise<void>`) 

| Parameter | Description | Example |
|-----------|-------------|---------|
| bearerTokenProvider | A function returning the bearer token to login to Arkane | `() => auth.token`|

This call makes sure that the user has an Arkane master pincode and at least one wallet necessary for the third party app.
 
## Full integration example
Below you can find a full example of how setting up Arkane Connect might look like. We also made an [example project](https://github.com/ArkaneNetwork/Arketype) as a more 
complete example. 
```javascript
let authenticated = false;
const arkaneConnect = new ArkaneConnect('Arketype', {chains: ['ethereum']});
arkaneConnect.checkAuthenticated()
             .then((result) => result.authenticated((auth) => { authenticated = true })
                                     .notAuthenticated((auth) => { authenticated = false }));
if (!authenticated) {
    arkaneConnect.authenticate();
}
```
# Using Arkane Connect
##Get Wallets

```javascript
arkaneConnect.api.getWallets();
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
arkaneConnect.manageWallets();
```
Calling this function will redirect the user to a page where he can mange the wallets linked to your application

## Get Profile
```javascript
arkaneConnect.api.getProfile();
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
const signer  = arkaneConnect.createSigner();
```
This will open the signer popup and starts listening for a transactionRequest.

**WARNING**

If you are executing a transaction as reaction to an event (e.g. a button click), call `arkaneConnect.createSigner()` as very first in your event handling, otherwise the popup might get blocked by the popup blocker of the browser.  

### Closing the signer
```javascript
arkaneConnect.destroySigner();
```
This function will cleanup and close the signer.

### Executing a transaction
```javascript
signer.executeTransaction(transactionRequest: any);
```
(returns `Promise<ResponseBody<{transactionHash: string}>>`)

Executing a transaction can be done by calling the `executeTransaction(...)` function on the signer. This will send the transaction request to the popup and then allows the 
user to enter it's PIN code as confirmation (or tweak some advanced setting).

Examples of how such a transaction request looks like can be found further down this document.

#### Full example
```javascript
const signer = arkaneConnect.createSigner();

signer.executeTransaction({
    type: "ETHEREUM_TRANSACTION",
    walletId: $("#sign-select-ETHEREUM").val(),
    to: "0xf147cA0b981C0CD0955D1323DB9980F4B43e9FED",
    value: 3140000000000000000,
}).then((result) => {
   if (result.success) {
       console.log(`Transaction ${result.result.transactionHash} has been successfully executed!`);
   } else {
       console.warn(`Something went wrong while executing the transaction`);
   }
}).catch((reason) => {
    signer.close();
    console.log(error);
});
```

### Executing a native transaction

You can also choose to use a native transaction instead of the generic one. This opens up some chain specific functionalities (e.g. multiple clauses for VeChain). For this you need 
to submit a native transaction request (see specifics at the end of this README) by calling the following function:  
```javascript
const signer = arkaneConnect.createSigner();

signer.executeNativeTransaction({...transactionRequest...})
      .then((result) => {
          if (result.success) {
              console.log(`Transaction ${result.result.transactionHash} has been successfully executed!`);
          } else {
              console.warn(`Something went wrong while executing the transaction`);
          }
      }).catch((reason) => {
          console.log(error);
      });
```  

#### Native Transaction requests
Below you can find an overview of the different types of native transaction requests.

##### Ethereum (ETH) Transaction Request
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

##### Ethereum ERC20 Transaction Request
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

##### VeChain (VET) Transaction Request
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

##### VeChain VTHO Transaction Request
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

##### VeChain VIP180 Transaction Request
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

## Signing data / transactions

Lastly you can use the `signer.signTransaction(...)` function to sign data or a transaction. This function accepts `signatureRequest`s of which you can find an overview below and will return a 
Promise containing a result which on its turn contains the signed transaction.

```javascript
const signer = arkaneConnect.createSigner();

signer.signTransaction({...signatureRequest...})
      .then((result) => {
          if (result.success) {
              console.log(`The request has been successfuly signed: ${result.result.signedTransaction}`);
          } else {
              console.warn(`Something went wrong while signing the request`);
          }
      }).catch((reason) => {
          console.log(error);
      });
```  

### Signature requests

#### Ethereum RAW signature request

```javascript
{
    type: 'ETHEREUM_RAW',
    walletId: string,       // The id of the wallet to be used as 'from'
    data: string            // The data you want to sign
}
```

#### Ethereum transaction signature request

```javascript
{
    type: 'ETHEREUM_TRANSACTION',
    walletId: string,       // The id of the wallet to be used as 'from'
    submit: boolean,        // Indicates whether or not the signed transaction needs to be submitted to the blockchain 
    gasPrice?: number,      // The gas price in wei. If omitted, a gas estimator will be used. There is also a possibility to adjust this in the signer.    
    gas?: number,           // The gas limit. If omitted, a gas estimator will be used. There is also a possibility to adjust this in the signer.
    nonce?: number,         // The nonce. If omitted, it will be automatically filled.
    value: number,          // The amount of ETH in wei 
    to: string,             // The Ethereum address to send the amount to
    data: string            // The data you want to sign
}
```

#### VeChain transaction signature request

```javascript
{
    type: 'VECHAIN_TRANSACTION',
    walletId: string,       // The id of the wallet to be used as 'from'
    submit: boolean,        // Indicates whether or not the signed transaction needs to be submitted to the blockchain 
    blockRef?: string,      // The blockRef
    chainTag?: string,      // The chainTag
    expiration?: number,    // The expiration
    gas?: number,           // The gas limit. If omitted, a gas estimator will be used. There is also a possibility to adjust this in the signer.
    gasPriceCoef?: number,  // The gas price coeficient. If omitted, 0 will be used. There is also a possibility to adjust this in the signer.
    nonce?: number,         // The nonce. If omitted, it will be automatically filled.
    clauses: [{             // the clauses to execute in this transaction     
        to: string,         // The VeChain address to send the amount to
        amount: number,     // The amount of VET in wei 
        data: string        // The data you want to sign
    }]
}
```

### More examples
For more examples on how to use Arkane Connect, make sure to checkout our example project on GitHub: https://github.com/ArkaneNetwork/Arketype