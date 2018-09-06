import Vue from 'vue';
import Vuex from 'vuex';
import Api from './api';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        environment: 'prod',
        hasMasterPin: false,
        userId: '',
        auth: {},
        config: {},
        tokens: {},
    },
    mutations: {
        setEnvironment: (state: any, environment: string) => {
            state.environment = environment;
        },
        setHasMasterPin: (state: any, pin: string) => {
            state.hasMasterPin = pin;
        },
        setAuth: (state: any, auth: any) => {
            state.auth = auth;
        },
    },
    actions: {
        getUserData: (state: any) => {
            const profile = Api.getProfile() as any;
            state.hasMasterPin = profile.hasMasterPin;
            state.userId = profile.userId;
        },
    },
});
