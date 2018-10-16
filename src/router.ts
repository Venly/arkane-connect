import Vue from 'vue';
import Router from 'vue-router';
import {Component, Route} from 'vue-router/types/router';

import SignEthereumTransactionView from './views/signer/SignEthereumTransactionView.vue';
import SignVeChainTransactionView from './views/signer/SignVeChainTransactionView.vue';
import Security from './Security';
import Utils from './utils/Utils';
import store from './store';
import {Profile} from '@/models/Profile';
import {Wallet} from '@/models/Wallet';

Vue.use(Router);

const loadView = (view: string) => {
    return () => import (`./views/${view}View.vue`);
};

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
                path: '/sign/transaction/init',
                name: 'init-sign-transaction',
                component: loadView('InitTransaction'),
            },
            {
                path: '/sign/transaction/ethereum_transaction/:bearer',
                name: 'sign-ethereum-transaction',
                component: SignEthereumTransactionView,
                meta: {
                    auth: true,
                },
            },
            {
                path: '/sign/transaction/vechain_transaction/:bearer',
                name: 'sign-vechain-transaction',
                component: SignVeChainTransactionView,
                meta: {
                    auth: true,
                },
            },
            {
                path: '/init/:chain/:bearer/createwallet',
                name: 'create-wallet',
                component: loadView('CreateWallet'),
                meta: {
                    authArkane: true,
                },
                beforeEnter: async (to, from, next) => {
                    await fetchProfileAndWallets(to).then(() => next())
                                                    .catch(() => next({name: 'generic-error'}));
                },
            },
            {
                path: '/init/:chain/:bearer/linkwallet',
                name: 'link-wallet',
                component: loadView('LinkWallet'),
                meta: {
                    authArkane: true,
                },
                beforeEnter: async (to, from, next) => {
                    await fetchProfileAndWallets(to).then((result: any) => {
                                                        const profile: Profile = result[0];
                                                        const wallets: Wallet[] = result[1];
                                                        const chain = (to.params as any).chain;

                                                        if (profile.hasMasterPin && Utils.wallets.hasWalletsForChainType(wallets, chain)) {
                                                            next();
                                                        } else {
                                                            next({name: 'create-wallet', params: to.params, query: to.query});
                                                        }
                                                    })
                                                    .catch(() => next({name: 'generic-error'}));
                },
            },
            {
                path: '/init/:chain/:bearer',
                name: 'init',
                meta: {
                    authArkane: true,
                },
                beforeEnter: async (to, from, next) => {
                    await fetchProfileAndWallets(to).then((result: any) => {
                                                        const profile: Profile = result[0];
                                                        const wallets: Wallet[] = result[1];
                                                        const chain = (to.params as any).chain;

                                                        if (profile.hasMasterPin && Utils.wallets.hasWalletsForChainType(wallets, chain)) {
                                                            next({name: 'link-wallet', params: to.params, query: to.query});
                                                        } else {
                                                            next({name: 'create-wallet', params: to.params, query: to.query});
                                                        }
                                                    })
                                                    .catch(() => next({name: 'generic-error'}));
                },
            },
            {path: '/error', name: 'generic-error', component: loadView('Error')},
            {path: '/unauthorized', name: 'unauthorized', component: loadView('Unauthorized')},
            {path: '/', component: loadView('Index')},
            {path: '*', component: loadView('Error404')},
        ],
    },
);

function checkAuthorize(to: Route): Promise<any> {
    let bearer = '';
    let token: any;
    let environment: any;
    let clientId: any;
    let doLogin = false;
    let useTokenToLogin = false;
    if (to.params) {
        bearer = (to.params as any).bearer;
        token = Security.parseToken(bearer);
        store.commit('setThirdPartyToken', token);
        clientId = token ? token.azp : '';
        environment = (to.query as any).environment;
        Utils.environment = environment;
        store.commit('setEnvironment', environment);
        const chain = (to.params as any).chain;
        if (chain) {
            store.commit('setChain', chain);
        }
    }

    if (to.matched.some((record) => record.meta.authArkane)) {
        doLogin = true;
        useTokenToLogin = false;
        clientId = process.env.VUE_APP_CLIENT_ID;
    } else if (to.matched.some((record) => record.meta.auth)) {
        doLogin = true;
        useTokenToLogin = true;
    }

    if (doLogin) {
        return new Promise((resolve) => {
            Security.verifyAndLogin(clientId, bearer, token, environment, useTokenToLogin, Utils.urls.connect + to.fullPath)
                    .then((result: any) => {
                        store.commit('setAuth', result.keycloak);
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
