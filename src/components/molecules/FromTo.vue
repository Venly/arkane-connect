<template>
    <div class="from-to-card">
        <address-card class="from-to-card__from" :label="'From'" :wallet="{address:from.address, description:from.description}" :stripeClass="'blue'" :max-lines="maxLines"></address-card>
        <address-card class="from-to-card__to" :label="'To'" :wallet="{address:to}" :addresses="toAddresses" :stripeClass="'pink'" :max-lines="maxLines"></address-card>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {Component, Prop} from 'vue-property-decorator';
    import AddressCard from '../atoms/AddressCard.vue';
    import {Wallet} from '../../models/Wallet';

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
    }
</script>

<style lang="sass" scoped>
    @import "../../assets/sass/mixins-and-vars"

    .from-to-card
        &__from
            width: 100%

        &__to
            width: 100%
            margin-top: 1.5rem

</style>