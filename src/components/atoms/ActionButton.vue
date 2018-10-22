<template>
    <button class="btn" :class="`btn--${type}`" :title="title" v-tooltip="title" @click="$emit('click', $event)">
        <slot>This is a text slot</slot>
    </button>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {VTooltip} from 'v-tooltip';

    @Component({
        directives: {tooltip: VTooltip},
    })
    export default class ActionButton extends Vue {
        @Prop({default: 'default'}) public type!: 'default' | 'success' | 'danger' | 'brand' | 'brand-light';
        @Prop() public title!: any;
    }
</script>

<style lang="sass" scoped>
</style>
