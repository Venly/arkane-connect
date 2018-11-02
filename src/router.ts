import Vue from 'vue';
import Router from 'vue-router';
import {Component, Route} from 'vue-router/types/router';

import InitTransactionView from './views/InitTransactionView.vue';
import ManageWalletsView from './views/ManageWalletsView.vue';
import CreateWalletView from './views/CreateWalletView.vue';
import ImportWalletView from './views/ImportWalletView.vue';
import ErrorView from './views/ErrorView.vue';
import UnauthorizedView from './views/UnauthorizedView.vue';
import IndexView from './views/IndexView.vue';
import Error404View from './views/Error404View.vue';
import SignEthereumTransactionView from './views/signer/ethereum/SignEthereumTransactionView.vue';
import SignVeChainTransactionView from './views/signer/vechain/SignVeChainTransactionView.vue';
import ExecuteEthTransactionView from './views/executor/ethereum/ExecuteEthTransactionView.vue';
import ExecuteEthERC20TransactionView from './views/executor/ethereum/ExecuteEthERC20TransactionView.vue';
import ExecuteVetTransactionView from './views/executor/vechain/ExecuteVetTransactionView.vue';
import Security from './Security';
import Utils from './utils/Utils';
import store from './store';

Vue.use(Router);

async function fetchProfileAndWallets(to: Route) {
    if (!store.state.auth.authenticated) {
        await checkAuthorize(to);
    }
    return Promise.all([
        store.dispatch('fetchUserData'),
        store.dispatch('fetchUserWallets'),
    ]);
}

const router = new Router(
    {
        mode: 'history',
        base: process.env.BASE_URL,
        routes: [
            {
                path: '/transaction/init',
                name: 'init-sign-transaction',
                component: InitTransactionView,
            },
            {
                path: '/transaction/sign/ethereum_transaction',
                name: 'sign-ethereum-transaction',
                component: SignEthereumTransactionView,
                meta: {
                    auth: true,
                },
            },
            {
                path: '/transaction/sign/vechain_transaction',
                name: 'sign-vechain-transaction',
                component: SignVeChainTransactionView,
                meta: {
                    auth: true,
                },
            },
            {
                path: '/transaction/execute/eth_transaction',
                name: 'execute-eth-transaction',
                component: ExecuteEthTransactionView,
                meta: {
                    auth: true,
                },
            },
            {
                path: '/transaction/execute/ethereum_erc20_transaction',
                name: 'execute-eth-erc20-transaction',
                component: ExecuteEthERC20TransactionView,
                meta: {
                    auth: true,
                },
            },
            {
                path: '/transaction/execute/vet_transaction',
                name: 'execute-vet-transaction',
                component: ExecuteVetTransactionView,
                meta: {
                    auth: true,
                },
            },
            {
                path: '/wallets/manage/:chain',
                name: 'manage-wallets',
                component: ManageWalletsView,
                meta: {
                    authArkane: true,
                },
                beforeEnter: async (to, from, next) => {
                    await fetchProfileAndWallets(to).then((result: any) => next())
                                                    .catch(() => next({name: 'generic-error'}));
                },
            },
            {
                path: '/wallets/manage/:chain/createwallet',
                name: 'create-wallet',
                component: CreateWalletView,
                meta: {
                    authArkane: true,
                },
                beforeEnter: async (to, from, next) => {
                    await fetchProfileAndWallets(to).then(() => next())
                                                    .catch(() => next({name: 'generic-error'}));
                },
            },
            {
                path: '/wallets/manage/:chain/importwallet',
                name: 'import-wallet',
                component: ImportWalletView,
                meta: {
                    authArkane: true,
                },
                beforeEnter: async (to, from, next) => {
                    await fetchProfileAndWallets(to).then(() => next())
                                                    .catch(() => next({name: 'generic-error'}));
                },
            },
            {path: '/error', name: 'generic-error', component: ErrorView},
            {path: '/unauthorized', name: 'unauthorized', component: UnauthorizedView},
            {path: '/', component: IndexView},
            {path: '*', component: Error404View},
        ],
    },
);

function checkAuthorize(to: Route): Promise<any> {
    let bearer = '';
    let environment: any;
    let doLogin = false;
    let useTokenToLogin = false;

    if (to.params) {
        bearer = (to.params as any).bearer;
        const chain = (to.params as any).chain;
        if (chain) {
            store.commit('setChain', chain);
        }
    }

    if (to.query) {
        environment = (to.query as any).environment;
        Utils.environment = environment;
        if (!bearer || bearer === '') {
            bearer = (to.query as any).bearerToken;
        }
    }

    if (to.matched.some((record) => record.meta.authArkane)) {
        doLogin = true;
        useTokenToLogin = false;
    } else if (to.matched.some((record) => record.meta.auth)) {
        doLogin = true;
        useTokenToLogin = true;
    }

    if (doLogin) {
        return new Promise((resolve) => {
            Security.verifyAndLogin(bearer, useTokenToLogin, Utils.urls.connect + to.fullPath)
                    .then((result: any) => {
                        store.commit('setAuth', result.keycloak);
                        store.commit('setThirdPartyToken', Security.parseToken(bearer));
                        resolve(result.authenticated);
                    })
                    .catch(() => {
                        resolve(false);
                    });
        });
    } else {
        return Promise.resolve(true);
    }
}

function asyncData(to: Route, from?: Route): Promise<any> {
    const matched = router.getMatchedComponents(to);
    let activated: Component[];
    if (from) {
        const prevMatched = router.getMatchedComponents(from);
        let diffed = false;
        activated = matched.filter((c: any, i: any) => {
            return diffed || (diffed = (prevMatched[i] !== c));
        });
    } else {
        activated = matched;
    }
    const asyncDataHooks = activated
        .map((c: Component) => (c as any).options && (c as any).options.asyncData)
        .filter((_: any) => _);

    if (!asyncDataHooks.length) {
        return Promise.resolve(true);
    }

    return Promise.all(asyncDataHooks.map((hook: any) => hook(store, to)));
}

const resolveRoute = async (to: Route, from?: Route) => {
    const proceed = await checkAuthorize(to);
    if (proceed) {
        await asyncData(to, from);
    }
    return proceed;
};

router.beforeEach(async (to: Route, from: Route, next: any) => {
    const proceed = await resolveRoute(to, from);

    if (!proceed) {
        next({name: 'unauthorized'});
    } else {
        next();
    }
});

export default router;
