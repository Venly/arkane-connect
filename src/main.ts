import Vue from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import VueIntercom from 'vue-intercom';

import '@/utils/FontAwesome';

Vue.use(VueIntercom, {appId: 'geuh54pb'});


Vue.config.productionTip = false;

const app = new Vue({
    router,
    store,
    render: (h) => h(App),
});

router.onReady(() => {
    app.$mount('#app');
});



