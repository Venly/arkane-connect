<template>
    <a @click.prevent="$emit('click', $event)">
        {{num}}
    </a>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component
    export default class NumpadNumber extends Vue {
        @Prop({default: 0}) public num!: number;
    }
</script>
