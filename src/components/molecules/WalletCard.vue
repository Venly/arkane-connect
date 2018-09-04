<template>
    <div class="wallet-card">
        <div class="wallet-card__details">
            <div class="wallet-card__icon">
                <!--<font-awesome-icon icon="star" :aria-label="'todo: Ethereum'"></font-awesome-icon>-->
            </div>
            <div class="wallet-card__alias-address">
                <div class="wallet-card__alias" v-if="wallet.alias">
                    {{wallet.alias}}
                </div>
                <div class="wallet-card__address">
                    {{wallet.address}}
                </div>
            </div>
        </div>
        <div class="wallet-card__amount" v-if="showFunds">
            123 STATICVAL
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {Component, Prop} from 'vue-property-decorator';
    import {Wallet} from '@/models/Wallet';

    @Component
    export default class WalletCard extends Vue {
        @Prop()
        public wallet!: Wallet;
        @Prop({default: false})
        public showFunds!: boolean;

        // todo: update static val to real amount
    }
</script>

<style lang="sass" scoped>
</style>