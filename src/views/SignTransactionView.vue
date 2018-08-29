<template>
    <div class="home">
        <div v-if="isLoggedIn">
            <div class="logo-wrapper">
                <img class="logo" alt="Arkane Logo" src="../assets/logo-arkane-animated.svg"/>
            </div>
            <numpad :title="'Enter your pincode to sign this transaction'"
                    :params="params"
                    @signed="sendTransactionSignedMessage"></numpad>
        </div>
        <div v-else>
            <p>{{loadingText}}</p>
        </div>
    </div>
</template>

<script lang='ts'>
    import {Component, Vue} from 'vue-property-decorator';
    import axios from 'axios';
    import * as KJUR from 'jsrsasign';
    import Keycloak, {KeycloakInstance} from 'keycloak-js';
    import Numpad from '@/components/molecules/Numpad.vue';
    import {EVENT_TYPES} from '../types/EventTypes';
    import {CHAIN_TYPES} from '../types/ChainTypes';
    import Utils from '@/utils/Utils';
    import ResponseBody from '@/api/ResponseBody';
    import VechainTransactionData from '@/api/VechainTransactionData';
    import EthereumTransactionData from '@/api/EthereumTransactionData';

    declare const window: Window;

    @Component({
        components: {
            Numpad,
        },
    })
    export default class SignTransactionView extends Vue {
        public isLoggedIn = false;
        public loadingText = 'Checking credentials ...';
        public params: EthereumTransactionData | VechainTransactionData = new EthereumTransactionData();

        private isEventSet = false;
        private event!: MessageEvent;
        private keycloak!: KeycloakInstance;
        private updateTokenInterval: any;

        public created() {
            this.addEventListeners();
            const token = this.$route.params && (this.$route.params as any).bearer || '';

            const publicKey = process.env.VUE_APP_REALM_PUBLIC_KEY || '';
            const tokenParsed = this.verifyToken(token, publicKey);
            if (tokenParsed) {
                this.initializeAuth({
                    'clientId': tokenParsed.aud,
                    'realm': process.env.VUE_APP_REALM,
                    'realm-public-key': process.env.VUE_APP_REALM_PUBLIC_KEY,
                    'url': process.env.VUE_APP_URL,
                    'auth-server-url': process.env.VUE_APP_AUTH_SERVER_URL,
                    'ssl-required': process.env.VUE_APP_SSL_REQUIRED,
                    'resource': process.env.VUE_APP_RESOURCE,
                    'public-client': process.env.VUE_APP_PUBLIC_CLIENT,
                });
            } else {
                this.notAuthenticated();
            }
        }

        public sendTransactionSignedMessage(result: ResponseBody) {
            (this.event.source as Window).postMessage({
                type: EVENT_TYPES.TRANSACTION_SIGNED,
                data: result,
            }, this.event.origin);
            this.isEventSet = false;
        }

        private verifyToken(token: string, publicKey: string): any {
            const jws = new KJUR.jws.JWS();
            jws.parseJWS(token);
            if (publicKey.indexOf('-----BEGIN PUBLIC KEY-----') === -1) {
                publicKey = `-----BEGIN PUBLIC KEY-----${publicKey}-----END PUBLIC KEY-----`;
            }
            const parsedToken = JSON.parse(jws.parsedJWS.payloadS);
            const result = KJUR.jws.JWS.verifyJWT(token, publicKey, {alg: ['RS256']});

            return result ? parsedToken : false;
        }

        private initializeAuth(config: string | {}) {
            const keycloak = Keycloak(config);
            keycloak.init({
                onLoad: 'check-sso',
            }).success((authenticated: any) => {
                if (authenticated) {
                    this.authenticated(keycloak.token);
                    this.setUpdateTokenInterval();
                } else {
                    this.notAuthenticated();
                }
            }).error(() => {
                this.notAuthenticated();
            });
        }

        private authenticated(token: string = '') {
            this.isLoggedIn = true;
            axios.defaults.headers.common = {
                Authorization: 'Bearer ' + token,
            };
        }

        private setUpdateTokenInterval() {
            if (this.updateTokenInterval) {
                clearInterval(this.updateTokenInterval);
                this.updateTokenInterval = null;
            }
            this.updateTokenInterval = setInterval(async () => {
                new Promise((resolve, reject) => {
                    if (this.keycloak) {
                        this.keycloak.updateToken(70).success((refreshed: any) => {
                            resolve(refreshed);
                        });
                    } else {
                        reject(false);
                    }
                }).then((refreshed: any) => {
                    if (refreshed) {
                        this.authenticated(this.keycloak.token);
                    }
                }).catch(() => {
                    (console as any).error('failed to refresh token');
                    this.notAuthenticated();
                    clearInterval(this.updateTokenInterval);
                    this.updateTokenInterval = null;
                });
            }, 60000);
        }

        private notAuthenticated() {
            this.isLoggedIn = false;
            axios.defaults.headers.common = {
                Authorization: '',
            };
            this.loadingText = 'Not authenticated, going back in 3 seconds.';
            setTimeout(() => {
                (window as any).close();
            }, 3000);
        }

        private addEventListeners() {
            window.addEventListener('message', (event: MessageEvent) => {
                if (!this.isEventSet && Utils.isWhitelistedOrigin(event.origin)) {
                    const data = event.data;
                    if (data && data.type === EVENT_TYPES.SEND_PARAMS) {
                        switch (data.chain) {
                            case CHAIN_TYPES.VECHAIN:
                                this.params = Object.assign(new VechainTransactionData(), data.params);
                                break;
                            default:
                                this.params = Object.assign(new EthereumTransactionData(), data.params);
                        }
                        this.event = event;
                        this.isEventSet = true;
                    }
                }
            }, false);
            window.addEventListener('beforeunload', () => {
                (this.event.source as Window).postMessage({
                    type: EVENT_TYPES.POPUP_CLOSED,
                }, this.event.origin);
            });
        }
    }
</script>

<style lang='sass' scoped>
    .logo-wrapper
        padding-bottom: 5px
        margin-bottom: 20px
        border-bottom: 1px solid #e5e5e5

        .logo
            padding: 5px
            width: auto
            height: 35px
            @media (min-height: 600px)
                height: 60px
</style>
