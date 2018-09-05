import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        hasMasterPin: false,
        userId: '',
        auth: {},
        config: {},
        tokens: {},
    },
    mutations: {
        setHasMasterPin: (state: any, pin: string) => {
            state.hasMasterPin = pin;
        },
        setAuth: (state: any, auth: any) => {
            state.auth = auth;
        },
    },
    actions: {},
});
