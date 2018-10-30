<template>
  <div>
    <div class="address-card" :class="stripeClass" :title="wallet.address">
      <div class="address-card__details">
        <div class="address-card__label">
          {{label}}<span v-if="wallet.description">: {{wallet.description}}</span>
        </div>
        <div class="address-card__address">
          <dots-in-between v-if="wallet.address !== ''" :chars="20" :text="wallet.address"></dots-in-between>
          <div v-if="(addresses !== [] && index < maxLines)" v-for="(address, index) in addresses">
            <dots-in-between v-if="(index < maxLines - 1) || (addresses.length == maxLines)" :chars="20" :text="address"></dots-in-between>
            <span v-if="(addresses.length !== maxLines) && (index == maxLines - 1)">&hellip;</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {Component, Prop} from 'vue-property-decorator';
    import DotsInBetween from './DotsInBetween.vue';

    @Component({
        components: {DotsInBetween},
    })
    export default class AddressCard extends Vue {
        @Prop({required: false, default: ''})
        public wallet?: { address: string, description?: string };

        @Prop({required: false, default: () => []})
        public addresses?: string[];

        @Prop()
        public label!: string;

        @Prop()
        public stripeClass!: string;

        @Prop({required: false, default: 1})
        public maxLines!: number;
    }
</script>

<style lang="sass" scoped>
  @import "../../assets/sass/mixins-and-vars"

  .address-card
    border-radius: $border-radius-small
    border: 1px solid $color-border
    font-size: $font-size-small
    margin: 0 auto
    overflow: hidden

    &.blue
      background-color: $color-bluish

    &.pink
      background-color: $color-brand-light

    &__details
      height: 100%
      padding: rem(7px 5px)
      margin-left: rem(10px)
      background-color: $color-white
      font-size: $font-size-regular
      line-height: $line-height-regular
      letter-spacing: rem(0.5px)

    &__label
      margin-bottom: rem(5px)

    &__address
      color: $color-text-light
      white-space: nowrap
      overflow: hidden
      font-weight: $font-weight-light
      display: inline-block
      width: 100%

      &-piece
        white-space: nowrap
        overflow: hidden

      &-front
        text-overflow: ellipsis
        float: left
        width: 55%

      &-back
        direction: rtl
        width: 45%

</style>