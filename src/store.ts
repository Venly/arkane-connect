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
        setProfile: (state: any, {userId, hasMasterPin}) => {
            state.userId = userId;
            state.hasMasterPin = hasMasterPin;
        },
        setAuth: (state: any, auth: any) => {
            state.auth = auth;
        },
    },
    actions: {
        getUserData: async (store: any) => {
            const profile = await Api.getProfile() as any;
            store.commit('setProfile', profile);
        },
    },
});
