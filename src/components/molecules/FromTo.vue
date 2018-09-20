<template>
  <div class="from-to-card">
    <address-card class="from-to-card__from" :label="'From'" :address="from" :stripeClass="'blue'"></address-card>
    <font-awesome-icon icon="arrow-right" class="icon from-to-card__arrow"></font-awesome-icon>
    <address-card class="from-to-card__to" :label="'To'" :address="to" :stripeClass="'pink'"></address-card>
  </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {Component, Prop} from 'vue-property-decorator';
    import AddressCard from '../atoms/AddressCard.vue';
    @Component({
        components: {AddressCard},
    })
    export default class FromTo extends Vue {
        @Prop()
        public from!: string;
        @Prop()
        public to!: string;
    }
</script>

<style lang="sass" scoped>
  @import "../../assets/sass/mixins-and-vars"

  .from-to-card
    display: flex

    &__from
      width: rem(115px)
      margin-left: 0

    &__to
      width: rem(115px)
      margin-right: 0

    &__arrow
      width: rem(12.6px)
      height: rem(53px)

</style>