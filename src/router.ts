import Vue from 'vue';
import Router from 'vue-router';
import SignTransactionView from './views/SignTransactionView.vue';
import InitView from './views/InitView.vue';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/sign/transaction/:bearer',
            name: 'sign-transaction',
            component: SignTransactionView,
        },
        {
            path: '/unauthorized',
            name: 'unauthorized',
            // route level code-splitting
            // this generates a separate chunk (unauthorized.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "unauthorized" */ './views/UnauthorizedView.vue'),
        },
        {
            path: '/init/:bearer',
            name: 'init',
            component: InitView,
            meta: {
                authArkane: true,
            },
        },
    ],
});
