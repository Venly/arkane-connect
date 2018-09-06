import Vue from 'vue';
import Vuex from 'vuex';
import Api from './api';
import {Wallet} from '@/models/Wallet';
import {SecretTypeUtil} from '@/models/SecretType';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        environment: 'prod',
        hasMasterPin: false,
        userId: '',
        auth: {},
        config: {},
        tokens: {},
        wallets: [],
        chain: {},
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
        setHasMasterPin: (state: any, hasMasterPin: boolean) => {
            state.hasMasterPin = hasMasterPin;
        },
        addWallet: (state: any, wallet: Wallet) => {
            state.wallets = [...state.wallets, wallet];
        },
        setChain: (state: any, chain: string) => {
            state.chain = chain;
        },
    },
    actions: {
        getUserData: async (store: any) => {
            const profile = await Api.getProfile() as any;
            store.commit('setProfile', profile);
        },
        updateMasterPin: async (store: any, {oldMasterPin, masterPin}): Promise<boolean> => {
            const success = await Api.setMasterPin(masterPin, oldMasterPin);
            if (success) {
                store.commit('setHasMasterPin', true);
            }
            return success;
        },
        setMasterPin: async (store: any, masterPin: string): Promise<boolean> => {
            const success = await Api.setMasterPin(masterPin);
            store.commit('setHasMasterPin', success);
            return success;
        },
        createWallet: async (store: any, {secretType, masterPincode}): Promise<Wallet> => {
            const wallet = await Api.createWallet({masterPincode, secretType});
            store.commit('addWallet', wallet);
            return wallet;
        },
    },
    getters: {
        secretType: (state) => {
            return SecretTypeUtil.byChain(state.chain);
        },
    },
});
