import Vue from 'vue';
import VueIntercom from 'vue-intercom';

import store from './store';
import router from './router';
import Utils from './utils/Utils';

import App from './App.vue';

Vue.use(VueIntercom, {appId: Utils.env.VUE_APP_INTERCOM_APP_ID});

Vue.config.productionTip = false;

const app = new Vue({
    router,
    store,
    render: (h) => h(App),
});

router.onReady(() => {
    app.$mount('#app');
});



