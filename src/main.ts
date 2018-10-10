import Vue from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';

Vue.config.productionTip = false;

const app = new Vue({
    router,
    store,
    render: (h) => h(App),
});

router.onReady(() => {
    app.$mount('#app');
});



