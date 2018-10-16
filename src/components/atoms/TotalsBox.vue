<template>
  <div class="totals-box">
    <div class="totals-box__container">
      <div class="totals-box__amount">
        <span class="label">Amount:</span>
        <span class="value"> {{formattedAmountValue}}</span>
        <span class="currency"> {{amountCurrency}}</span>
      </div>
      <div class="totals-box__fee">
        <span class="label">Max fee:</span>
        <span class="value"> {{formattedFeeValue}}</span>
        <span class="currency"> {{feeCurrency}}</span>
      </div>
    </div>
    <div class="totals-box__settings_icon" v-if="showAdvancedIcon" @click="$emit('advanced-clicked')">
      <font-awesome-icon icon="sliders-h" class="icon"></font-awesome-icon>
    </div>
  </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {Component, Prop} from 'vue-property-decorator';
    import Utils from '../../utils/Utils';

    @Component
    export default class TotalsBox extends Vue {

        @Prop()
        public amountValue!: number;
        @Prop()
        public amountCurrency!: string;
        @Prop({required: false, default: {min: 2, max: 2}})
        public amountDecimals!: {min: number, max: number};

        @Prop()
        public feeValue!: number;
        @Prop()
        public feeCurrency!: string;
        @Prop({required: false, default: {min: 2, max: 2}})
        public feeDecimals!: {min: number, max: number};

        @Prop({required: false, default: false})
        public showAdvancedIcon?: boolean;

        public get formattedAmountValue() {
            return Utils.formatNumber(this.amountValue, this.amountDecimals.min, this.amountDecimals.max);
        }

        public get formattedFeeValue() {
            return Utils.formatNumber(this.feeValue, this.feeDecimals.min, this.feeDecimals.max);
        }
    }
</script>

<style lang="sass" scoped>
  @import "../../assets/sass/mixins-and-vars"

  .totals-box
    border-radius: $border-radius-small
    background-color: $color-white
    border: 1px solid $color-border
    margin: 0 auto
    font-size: $font-size-regular
    height: rem(69px)
    overflow: hidden
    padding: rem(15px 10px)
    line-height: rem(12px)
    letter-spacing: 0
    display: flex
    align-items: center
    justify-content: space-between

    .label
      width: rem(60px)

    &__amount
      display: flex
      justify-content: left
      align-items: center
      .value,
      .currency
        font-size: $font-size-bigger
      > *
        margin-right: rem(5px)

    &__fee
      margin-top: rem(12px)
      display: flex
      justify-content: left
      align-items: center
      .value,
      .currency
        font-weight: $font-weight-light
      > *
        margin-right: rem(5px)

    &__settings_icon
      padding: rem(2px)
      border-radius: rem(2px)
      border: 1px solid $color-bluish
      color: $color-bluish
      height: rem(21px)
      width: rem(21px)
      display: flex
      align-items: center
      justify-content: center
      &:hover
        border-color: $color-warm-grey
        color: $color-warm-grey
        cursor: pointer

      & .icon
        width: rem(15px)

</style>