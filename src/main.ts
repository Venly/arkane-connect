import Vue from 'vue';
import App from './App.vue';
import store from './store';
import router, {onReady} from './router';

Vue.config.productionTip = false;

const app = new Vue({
    router,
    store,
    render: (h) => h(App),
});

onReady(() => {
    app.$mount('#app');
});



