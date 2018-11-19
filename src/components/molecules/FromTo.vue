<template>
    <div class="from-to-card">
        <address-card class="from-to-card__from" :label="'From'" :wallet="fromWalletDetails" :stripeClass="'blue'" :max-lines="maxLines"></address-card>
        <address-card class="from-to-card__to" :label="'To'" :wallet="toWalletDetails" :addresses="toAddresses" :stripeClass="'pink'" :max-lines="maxLines"></address-card>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {Component, Prop, Watch} from 'vue-property-decorator';
    import AddressCard from '../atoms/AddressCard.vue';
    import {Wallet} from '../../models/Wallet';
    import Api from '../../api';

    @Component({
        components: {AddressCard},
    })
    export default class FromTo extends Vue {
        @Prop()
        public from!: Wallet;

        @Prop({required: false, default: ''})
        public to!: string;

        @Prop({required: false, default: () => []})
        public toAddresses!: string[];

        @Prop({required: false, default: 1})
        public maxLines!: number;

        private toWallet: Wallet;

        public mounted() {
            this.updateWallet();
        }

        @Watch('to')
        private async updateWallet() {
            let result = await Api.getWalletBySecretTypeAndAddress(this.from.secretType, this.to);
            if(result.length >= 1) {
                this.toWallet = result[0]
            } else {
                this.toWallet = null;
            }
        }

        public get fromWalletDetails() {
            return {
                address: this.from.address,
                description: this.from.description
            }
        }

        public get toWalletDetails() {
            if(this.toWallet) {
                return {
                    address: this.toWallet.address,
                    address: this.toWallet.description,
                };
            } else {
                return {
                    address: this.to,
                    description: ''
                };
            }
        }
    }
</script>

<style lang="sass" scoped>
    @import ../../assets/sass/mixins-and-vars

    .from-to-card
        &__from
            width: 100%

        &__to
            width: 100%
            margin-top: 1.5rem

</style>