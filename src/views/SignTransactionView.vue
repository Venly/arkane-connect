<template>
    <div class="home">
        <div v-if="isLoggedIn">
            <div class="logo-wrapper">
                <img class="logo" alt="Arkane Logo" src="../assets/logo-arkane-animated.svg"/>
            </div>
            <numpad :title="'Enter your pincode to sign this transaction'"></numpad>
        </div>
        <div v-else>
            <p>{{loadingText}}</p>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import axios from 'axios';
    import Numpad from '@/components/molecules/Numpad.vue';
    import Keycloak from 'keycloak-js';

    declare const window: Window;

    @Component({
        components: {
            Numpad,
        },
    })
    export default class SignTransactionView extends Vue {
        public isLoggedIn = false;
        public loadingText = 'Checking credentials ...';

        public created() {
            const keycloak = Keycloak({
                'clientId': process.env.VUE_APP_CLIENT_ID,
                'realm': process.env.VUE_APP_REALM,
                'realm-public-key': process.env.VUE_APP_REALM_PUBLIC_KEY,
                'url': process.env.VUE_APP_URL,
                'auth-server-url': process.env.VUE_APP_AUTH_SERVER_URL,
                'ssl-required': process.env.VUE_APP_SSL_REQUIRED,
                'resource': process.env.VUE_APP_RESOURCE,
                'public-client': process.env.VUE_APP_PUBLIC_CLIENT,
            });
            keycloak.init({
                onLoad: 'check-sso',
            }).success((authenticated: any) => {
                if (authenticated) {
                    this.isLoggedIn = true;
                    axios.defaults.headers.common = {
                        Authorization: 'Bearer ' + keycloak.token,
                    };
                } else {
                    this.notAuthenticated();
                }
            }).error(() => {
                this.notAuthenticated();
            });
        }

        public notAuthenticated() {
            axios.defaults.headers.common = {
                Authorization: '',
            };
            this.loadingText = 'Not authenticated, going back in 3 seconds.';
            setTimeout(() => {
                (window as any).close();
            }, 3000);
        }
    }
</script>

<style lang="sass" scoped>
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
