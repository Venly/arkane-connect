import Vue from 'vue';
import Router from 'vue-router';
import SignTransactionView from './views/SignTransactionView.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/sign/transaction',
    },
    {
      path: '/sign/transaction',
      name: 'sign-transaction',
      component: SignTransactionView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
  ],
});
