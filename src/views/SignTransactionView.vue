<template>
    <div class="home">
        <div v-if="isLoggedIn">
            <img class="logo" alt="Arkane Logo" src="../assets/logo-arkane-a-light.svg"/>
            <h3>enter your pincode to sign this transaction.</h3>
            <numpad></numpad>
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
    import config from '../keycloak.json';

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
            const keycloak = Keycloak(config);
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
    .logo
        width: 25px
        height: 25px

    h3
        font-size: 12px

    @media (min-height: 600px)
        .logo
            width: 100px
            height: 100px
        h3
            font-size: 20px
</style>
