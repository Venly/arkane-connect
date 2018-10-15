<template>
  <span>{{ellipsisText}}</span>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {Component, Prop} from 'vue-property-decorator';
    import {VTooltip} from 'v-tooltip';

    @Component
    export default class DotsInBetween extends Vue {
        @Prop() public chars!: number;
        @Prop() public text!: string;

        public get ellipsisText() {
            if (this.text.length <= this.chars) {
                return this.text;
            } else if (this.chars > 0) {
                const startLength = Math.ceil(this.chars / 2);
                const endLength = this.chars - startLength;
                return `${this.text.substr(0, startLength)}...${this.text.substr(-endLength, endLength)}`;
            } else {
                return '';
            }
        }
    }
</script>

<style lang="sass" scoped>
  @import ../../assets/sass/mixins-and-vars
</style>