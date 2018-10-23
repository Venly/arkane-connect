<template>
    <input class="input" :value="value" @change="onChange"/>
</template>

<script lang="ts">
    import {Component, Model, Vue} from 'vue-property-decorator';

    @Component
    export default class InputField extends Vue {
        @Model('change', {type: String}) public value!: any;

        public onChange(event: any): void {
            this.$emit('change', event.target.value);
        }
    }
</script>

<style lang="sass" scoped>
    @import ../../assets/sass/mixins-and-vars

    .input
        border-radius: $border-radius-small
        border: 1px solid $color-dark-grey
        font-size: $font-size-small
        line-height: 1rem
        padding: .25rem

        &::placeholder
            font-style: italic
            color: $color-warm-grey
            text-transform: capitalize
        &:active, &:focus
            border-color: $color-primary

</style>
