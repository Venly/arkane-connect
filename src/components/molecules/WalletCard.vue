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
    @import ../../assets/sass/mixins-and-vars

    .wallet-card
        border-radius: $border-radius-small
        border: 1px solid $color-border
        padding: rem(12px 16px)
        background-color: $color-white
        font-size: $font-size-small
        max-width: 100%

        &__details
            display: flex
            align-items: center
            margin-bottom: rem(16px)

        &__alias-address
            max-width: calc(100% - #{rem(22px)})

        &__icon
            > svg
                width: rem(12px)
                height: auto
                margin-right: rem(10px)

        &__title
            font-weight: $font-weight-bold

        &__address
            color: $color-text-light
            white-space: nowrap
            overflow: hidden
            text-overflow: ellipsis

        &__amount
            color: $color-grass
</style>