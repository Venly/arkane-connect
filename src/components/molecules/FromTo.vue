<template>
    <div class="from-to-card">
        <address-card class="from-to-card__from" :label="'From'" :address="from" :stripeClass="'blue'" :max-lines="maxLines"></address-card>
        <font-awesome-icon icon="arrow-right" class="icon from-to-card__arrow"></font-awesome-icon>
        <address-card class="from-to-card__to" :label="'To'" :address="to" :addresses="toAddresses" :stripeClass="'pink'" :max-lines="maxLines"></address-card>
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

        @Prop({required: false, default: ''})
        public to!: string;

        @Prop({required: false, default: () => []})
        public toAddresses!: string[];

        @Prop({required: false, default: 1})
        public maxLines!: number;
    }
</script>

<style lang="sass" scoped>
    @import "../../assets/sass/mixins-and-vars"

    .from-to-card
        display: flex
        justify-content: space-between

        &__from
            width: rem(115px)
            margin-left: 0

        &__to
            width: rem(115px)
            margin-right: 0

        &__arrow
            width: rem(12px)
            height: rem(53px)

</style>