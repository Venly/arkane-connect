import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Security from '@/security';
import {Route} from 'vue-router';

Vue.config.productionTip = false;


router.beforeEach(async (to: Route, from: Route, next: any) => {
    if (to.matched.some((record) => record.meta.authArkane)) {
        const token = to.params && (to.params as any).bearer || '';
        const result = await Security.verifyAndLogin(token, false).catch(async () => {
            next({name: 'unauthorized'});
        });
        store.commit('setAuth', result.keycloak);
        if (result.authenticated) {
            next();
        } else {
            next({name: 'unauthorized'});
        }
    } else {
        next();
    }
});

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');

