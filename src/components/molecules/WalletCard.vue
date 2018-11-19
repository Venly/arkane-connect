<template>
    <div class="wallet-card" :class="{'one-line': oneLine}" @click="click">
        <div class="wallet-card__details">
            <div class="wallet-card__icon">
                <i class="icon-chain" :class="`icon-chain--${wallet.secretType.toLowerCase()}`"></i>
            </div>
            <div class="wallet-card__alias-address">
                <div class="wallet-card__alias" v-if="wallet.description">
                    {{wallet.description}}
                </div>
                <div class="wallet-card__address">
                    <span :v-tooltip="wallet.address" :title="wallet.address">{{wallet.address}}</span>
                </div>
            </div>
        </div>
        <div class="wallet-card__amount" v-if="showFunds">
            {{wallet.balance.balance}} {{wallet.balance.symbol}}
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
        @Prop({required: false, default: false})
        public oneLine!: boolean;

        public click(event: any): void {
            this.$emit('click', event);
        }
    }
</script>

<style lang="sass" scoped>
    @import ../../assets/sass/mixins-and-vars

    .wallet-card
        border-radius: $border-radius-small
        border: 1px solid $color-border
        padding: rem(16px 10px)
        background-color: $color-white
        font-size: $font-size-small
        max-width: 100%

        &__icon
            margin-right: rem(10px)
            width: rem(40px)
            flex-grow: 0
            flex-shrink: 0
            text-align: center

            .icon-chain
                font-size: rem(25px)
                vertical-align: middle

        &__details
            display: flex
            align-items: center

        &__alias-address
            max-width: calc(100% - #{rem(50px)})

        &__icon
            > svg
                width: rem(12px)
                height: auto
                margin-right: rem(10px)

        &__title
            font-weight: $font-weight-bold

        &__alias
            font-weight: $font-weight-bold

        &__address
            color: $color-text-light
            white-space: nowrap
            overflow: hidden
            text-overflow: ellipsis
            a
                color: $color-text-light

        &__amount
            color: $color-grass


    .one-line
        padding: rem(10px)

        .wallet-card__icon
            width: rem(20px)

            .icon-chain
              font-size: $font-size-regular

        .wallet-card__alias-address
            display: flex
            justify-items: center
            align-items: center

        .wallet-card__alias
            width: 100%
            margin-right: rem(5px)
            white-space: nowrap
            overflow: hidden
            text-overflow: ellipsis

        .wallet-card__address
            font-size: rem(11px)

</style>