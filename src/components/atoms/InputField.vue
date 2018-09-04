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
</style>
