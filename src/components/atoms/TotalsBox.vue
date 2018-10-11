<template>
  <div class="totals-box">
    <div class="totals-box__container">
      <div class="totals-box__amount">
        <span class="totals-box__amount-label">Amount:</span>
        <span class="totals-box__amount-value"> {{amountValue}}</span>
        <span class="totals-box__amount-currency"> {{amountCurrency}}</span>
      </div>
      <div class="totals-box__fee">
        <span class="totals-box__fee-label">Max transaction fee:</span>
        <span class="totals-box__fee-value"> {{feeValue}}</span>
        <span class="totals-box__fee-currency"> {{feeCurrency}}</span>
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

    @Component
    export default class TotalsBox extends Vue {
        @Prop()
        public amountValue!: number;
        @Prop()
        public amountCurrency!: string;
        @Prop()
        public feeValue!: number;
        @Prop()
        public feeCurrency!: string;

        @Prop({required: false, default: false})
        public showAdvancedIcon?: boolean;


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

    &__amount
      &-value,
      &-currency
        font-size: $font-size-bigger

    &__fee
      margin-top: rem(12px)
      &-value,
      &-currency
        font-weight: $font-weight-light

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
        border-color: $color-warm-gray
        color: $color-warm-gray
        cursor: pointer

      & .icon
        width: rem(15px)

</style>