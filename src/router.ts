import Vue from 'vue';
import Router from 'vue-router';
import {Component, Route} from 'vue-router/types/router';

import SignTransactionView from './views/SignTransactionView.vue';
import Security from './security';
import Utils from './utils/Utils';
import store from './store';

Vue.use(Router);

const loadView = (view: string) => {
    return () => import (`./views/${view}View.vue`);
};

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/sign/transaction/:clientId/:bearer/:environment?',
            name: 'sign-transaction',
            component: SignTransactionView,
            meta: {
                auth: true,
            },
        },
        {
            path: '/init/:bearer/:environment?',
            name: 'init',
            component: loadView('Init'),
            meta: {
                authArkane: true,
            },
        },
        {path: '*', component: loadView('Error404')},
        {path: '/unauthorized', name: 'unauthorized', component: loadView('Unauthorized')},
    ],
});

function checkAuthorize(to: Route): Promise<any> {
    let token = '';
    let environment: any;
    let clientId: any;
    let doLogin = false;
    let useTokenToLogin = false;

    if (to.params) {
        clientId = (to.params as any).clientId;
        token = (to.params as any).bearer;
        environment = (to.params as any).environment;
        Utils.environment = environment;
        store.commit( 'setEnvironment', environment);
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
            Security.verifyAndLogin(clientId, token, environment, useTokenToLogin)
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

export const onReady = (callback: any) => {
    router.onReady(() => {
        router.beforeResolve(async (to: Route, from: Route, next: any) => {
            const proceed = await resolveRoute(to, from);

            if (!proceed) {
                next({name: 'unauthorized'});
            } else {
                next();
            }
        });
        resolveRoute(router.currentRoute).then((proceed: boolean) => {
            if (!proceed) {
                router.replace({name: 'unauthorized'});
            }
            callback();
        });
    });
};

export default router;
