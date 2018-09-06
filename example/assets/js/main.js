var app = app || {};

app.addAuthEvents = function(authenticated, auth) {
    document.body.classList.add(authenticated ? 'logged-in' : 'not-logged-in');
    document.getElementById('auth-username').innerText = auth.subject + ' - ' + auth.token + ' - ';
    document.getElementById('auth-loginlink').addEventListener('click', function(e) {
        e.preventDefault();
        arkaneConnect.login({redirectUri: ''});
    });
    document.getElementById('auth-logout').addEventListener('click', function(e) {
        e.preventDefault();
        arkaneConnect.logout();
    });
};

app.addConnectEvents = function() {
    document.getElementById('arkane-sign-eth').addEventListener('click', function() {
        window.arkaneConnect.signEthereumTransaction({
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
    });

    document.getElementById('get-wallets').addEventListener('click', function() {
        window.arkaneConnect.getWallets().then(function(e) {
            console.log(e);
        });
    });

    document.getElementById('arkane-sign-vechain').addEventListener('click', function() {
        window.arkaneConnect.signVechainTransaction({
            type: 'VECHAIN_TRANSACTION',
            walletId: 44,
            submit: false,
            blockRef: "0x1",
            chainTag: "0x2",
            expiration: 10,
            gas: 23000,
            gasPriceCoef: 0,
            nonce: 0,
            clauses: [{
                to: '0xdc71b72db51e227e65a45004ab2798d31e8934c9',
                amount: "10000",
                data: '0x0',
            }]
        }).then(function(result) {
            console.log(result);
        }).catch(function(error) {
            console.log(error);
        });
    });
};

app.initApp = function() {
    window.arkaneConnect = new ArkaneConnect('ThorBlock', 'vechain', 'local');
    window.arkaneConnect.init().then(function(auth) {
        console.log(auth);
        app.addAuthEvents(auth.authenticated, auth);
        app.addConnectEvents();
    });
};

app.initApp();