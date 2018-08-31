var app = app || {};

app.initApp = function(authenticated, keycloak) {
    window.arkaneConnect = new ArkaneConnect('local', keycloak.token);
    app.addKeycloakEvents(authenticated, keycloak);
    app.addConnectEvents();
    app.getWallets();
};

app.getWallets = function() {
    window.arkaneConnect.getWallets().then(function(result) {
        console.log(result);
    })
};

app.addKeycloakEvents = function(authenticated, keycloak) {
    document.body.classList.add(authenticated ? 'logged-in' : 'not-logged-in');
    document.getElementById('keycloak-username').innerText = keycloak.subject + ' - ' + keycloak.token + ' - ';
    document.getElementById('keycloak-loginlink').addEventListener('click', function(e) {
        e.preventDefault();
        keycloak.login({redirectUri: ''});
    });
    document.getElementById('keycloak-logout').addEventListener('click', function(e) {
        e.preventDefault();
        keycloak.logout();
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

    document.getElementById('arkane-sign-vechain').addEventListener('click', function() {
        window.arkaneConnect.signVechainTransaction({
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
    });
};