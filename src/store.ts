import Vue from 'vue';
import Vuex from 'vuex';
import Api from './api';
import {Wallet} from '@/models/Wallet';
import {SecretTypeUtil} from '@/models/SecretType';
import {Snack, SnackType} from '@/models/Snack';

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
        thirdPartytoken: {},
        loading: false,
        snack: {},
        hasBlockingError: false,
        showModal: false,
        transactionWallet: {},
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
        setWallets: (state: any, wallets: Wallet[]) => {
            state.wallets = wallets;
        },
        addWallet: (state: any, wallet: Wallet) => {
            state.wallets = [...state.wallets, wallet];
        },
        setChain: (state: any, chain: string) => {
            state.chain = chain;
        },
        setThirdPartyToken: (state: any, thirdPartytoken: any) => {
            state.thirdPartytoken = thirdPartytoken;
        },
        setLoading: (state: any, isLoading: boolean) => {
            state.loading = isLoading;
        },
        setSnack: (state: any, snack: Snack) => {
            state.snack = snack;
        },
        setHasBlockingError: (state: any, hasBlockingError: boolean) => {
            state.hasBlockingError = hasBlockingError;
        },
        setShowModal: (state: any, showModal: boolean) => {
            state.showModal = showModal;
        },
        setTransactionWallet: async (state: any, wallet: Wallet) => {
            state.transactionWallet = wallet;
        },
    },
    actions: {
        getUserData: async (store: any) => {
            const profile = await Api.getProfile() as any;
            store.commit('setProfile', profile);
        },
        getUserWallets: async (store: any) => {
            const wallets = await Api.getWallets();
            store.commit('setWallets', wallets);
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
        createWallet: async (store: any, {secretType, masterPincode, clients}): Promise<Wallet> => {
            const wallet = await Api.createWallet({masterPincode, secretType, clients});
            store.commit('addWallet', wallet);
            return wallet;
        },
        startLoading: (store: any): void => {
            store.commit('setLoading', true);
        },
        stopLoading: (store: any): void => {
            store.commit('setLoading', false);
        },
        setError: async (store: any, message: string) => {
            store.commit('setSnack', {type: SnackType.DANGER, message, blocking: false});
        },
        setBlockingError: async (store: any, message) => {
            store.commit('setHasBlockingError', true);
            store.commit('setShowModal', true);
            store.commit('setSnack', {type: SnackType.DANGER, message, blocking: true});
        },
        resetError: async (store: any) => {
            store.commit('setSnack', {});
        },
        showModal: async (store: any) => {
            store.commit('setShowModal', true);
        },
        hideModal: async (store: any) => {
            store.commit('setShowModal', false);
        },
        setTransactionWallet: async (store: any, wallet: Wallet) => {
            store.commit('setTransactionWallet', wallet);
        },
    },
    getters: {
        secretType: (state) => {
            return SecretTypeUtil.byChain(state.chain);
        },
        thirdPartyClientId: (state) => {
            return state.thirdPartytoken.azp;
        },
    },
});
