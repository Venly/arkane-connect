var app = app || {};

app.initApp = function() {
    window.arkaneConnect = new ArkaneConnect('ThorBlock', ['VeChain'], 'local');
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
        //custom logic
        window.arkaneConnect.signTransaction({
            type: 'ETHEREUM_TRANSACTION',
            walletId: '192',
            submit: true,
            gasPrice: 4000000000,
            gas: 40000,
            value: 512345678765432000,
            to: '0x9d10dc3c5efa3c0ec3ca06b99b8451ab2ecb4401',
            data: '0x'
        }).then(function(result) {
            console.log(result);
        }).catch(function(error) {
            console.log(error);
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
        //custom logic
        window.arkaneConnect.signTransaction({
            type: 'VECHAIN_TRANSACTION',
            walletId: '192                                 ',
            submit: true,
            gas: 23000,
            gasPriceCoef: 0,
            clauses: [{
                to: '0xf29c73da25795469aba28277f831e85d49806b3f',
                amount: '20000000000000000000',
            },
                {
                    to: '0xf29c73da25795469aba28277f831e85d49806b3f',
                    amount: '30000000000000000000',
                },
                {
                    to: '0xd5B15fCfEBd094BD57C2eD07442f8f8636c5dfed',
                    amount: '20000000000000000000',
                },
                {
                    to: '0xd5B15fCfEBd094BD57C2eD07442f8f8636c5dfed',
                    amount: '30000000000000000000',
                },
                {
                    to: '0xf29c73da25795469aba28277f831e85d49806b3f',
                    amount: '20000000000000000000',
                },
                {
                    to: '0xf29c73da25795469aba28277f831e85d49806b3f',
                    amount: '30000000000000000000',
                }]
        }).then(function(result) {
            console.log(result);
        }).catch(function(error) {
            console.log(error);
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
