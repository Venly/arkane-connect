var app = app || {};

app.initApp = function() {
    window.arkaneConnect = new ArkaneConnect('ThorBlock', ['Ethereum'], 'local');
    window.arkaneConnect
          .checkAuthenticated()
          .then((result) => result.authenticated(app.handleAuthenticated)
                                  .notAuthenticated((auth) => {
                                      document.body.classList.add('not-logged-in');
                                  })
          )
          .catch(reason => console.log(reason));
    this.attachLinkEvents();
};

app.attachLinkEvents = function() {
    document.getElementById('auth-loginlink').addEventListener('click', function(e) {
        e.preventDefault();
        window.arkaneConnect.authenticate();
    });

    document.getElementById('auth-logout').addEventListener('click', function(e) {
        e.preventDefault();
        window.arkaneConnect.logout();
    });
};

app.handleAuthenticated = (auth) => {
    document.body.classList.add('logged-in');
    document.getElementById('auth-username').innerText = auth.subject;
    app.updateToken(auth.token);
    window.arkaneConnect.addOnTokenRefreshCallback(app.updateToken);
    app.addConnectEvents();
    app.getWallets();
};

app.updateToken = (token) => {
    document.getElementById('auth-token').innerText = token;
};

app.addConnectEvents = function() {
    document.getElementById('arkane-sign-eth').addEventListener('click', function() {
        //if you want to do custom logic between the user pressing a button and signing a transaction, please initialize the popup first as shown below
        // otherwise the browser might block the popup
        window.arkaneConnect.initPopup();

        window.arkaneConnect
              .buildTransactionRequest({
                  walletId: 192,
                  to: '0x9d10dc3c5efa3c0ec3ca06b99b8451ab2ecb4401',
                  value: 0.512345678765432,
                  secretType: 'ETHEREUM'
              })
              .then(transactionRequest => {
                  window.arkaneConnect
                        .executeTransaction(transactionRequest)
                        .then(function(result) {
                            console.log(result);
                        })
                        .catch(function(error) {
                            console.log(error);
                        });
              });
    });

    document.getElementById('get-wallets').addEventListener('click', function() {
        window.arkaneConnect.getWallets().then(function(e) {
            console.log(e);
        });
    });

    document.getElementById('get-profile').addEventListener('click', function() {
        window.arkaneConnect.getProfile().then(function(e) {
            console.log(e);
        });
    });

    document.getElementById('arkane-sign-vechain').addEventListener('click', function() {
        //if you want to do custom logic between the user pressing a button and signing a transaction, please initialize the popup first as shown below
        // otherwise the browser might block the popup
        window.arkaneConnect.initPopup();

        window.arkaneConnect
              .buildTransactionRequest({
                  walletId: 161,
                  to: '0x69661037987676C2210E0997bf6CB836e9D972f5',
                  value: 20.09,
                  secretType: 'VECHAIN'
              })
              .then(transactionRequest => {
                  window.arkaneConnect
                        .executeTransaction(transactionRequest)
                        .then(function(result) {
                            console.log(result);
                        })
                        .catch(function(error) {
                            console.log(error);
                        });
              });
    });

    document.getElementById('close-popup').addEventListener('click', function() {
        window.arkaneConnect.closePopup();
    });
};

app.getWallets = function() {
    window.arkaneConnect.getWallets().then(function(result) {
        console.log(result);
    })
};

app.initApp();
