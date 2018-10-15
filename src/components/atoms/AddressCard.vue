<template>
  <div class="address-card" :class="stripeClass" :title="address">
    <div class="address-card__details">
      <div class="address-card__label">
        {{label}}
      </div>
      <div class="address-card__address">
        <dots-in-between :chars="9" :text="address"></dots-in-between>
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
    @Prop()
    public address!: string;
    @Prop()
    public label!: string;
    @Prop()
    public stripeClass!: string;
}
</script>

<style lang="sass" scoped>
  @import "../../assets/sass/mixins-and-vars"

  .address-card
    border-radius: $border-radius-small
    border: 1px solid $color-border
    margin: 0 auto
    font-size: $font-size-small
    height: rem(53px)
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
      font-size: rem(14px)
      line-height: rem(17px)
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