<template>
</template>
<script lang='ts'>
    import Vue from 'vue';
    import {Component} from 'vue-property-decorator';
    import Api from '../../api';
    import {State} from 'vuex-class';

    @Component
export default class Intercom extends Vue {

    @State
    public auth!: any;

    public mounted() {
        if (this.auth && this.auth.tokenParsed) {
            Api.fetchIntercomVerification().then((iv) => {
                this.$intercom.boot({
                    user_id: this.auth.tokenParsed.sub,
                    name: this.auth.tokenParsed.name,
                    email: this.auth.tokenParsed.email,
                    user_hash: iv.hash,
                    hide_default_launcher: true,
                });
            });
        }
    }
}
</script>