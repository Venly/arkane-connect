import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        userState: {
            hasMasterPin: false,
            userId: '',
        },
        securityState: {
            auth: {},
            config: {},
            tokens: {},
        },
        mutations: {},
        actions: {},
    },
});
