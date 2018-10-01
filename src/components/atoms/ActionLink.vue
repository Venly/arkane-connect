<template>
    <a :class="`link link--${type}`" @click="$emit('click', $event)">
        <slot></slot>
    </a>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component
    export default class ActionLink extends Vue {
        @Prop({default: 'default'}) public type!:
            'default' | 'success' | 'danger' |
            'muted' | 'dark' | 'brand' |
            'brand-light';
    }
</script>

<style lang="sass" scoped>
</style>
