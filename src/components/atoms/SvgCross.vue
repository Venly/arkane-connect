<template>

    <svg viewBox="0 0 300 300">
        <polyline fill="none"
                  class="cross"
                  stroke="white"
                  stroke-width="50px"
                  stroke-dasharray="1000"
                  stroke-dashoffset="0"
                  stroke-linecap="round"
                  points="25, 25 275,275">
            <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="350ms" fill="freeze"></animate>
        </polyline>

        <polyline fill="none"
                  class="cross"
                  stroke="white"
                  stroke-width="50px"
                  stroke-dasharray="1000"
                  stroke-dashoffset="0"
                  stroke-linecap="round"
                  points="25,275 275, 25">
            <animate id="rightToLeftWait" attributeName="stroke-dashoffset" from="1000" to="1000" dur="150ms" fill="freeze"></animate>
            <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="350ms" fill="freeze" begin="rightToLeftWait.end"></animate>
        </polyline>
    </svg>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class SvgCross extends Vue {
    }
</script>

<style lang="sass" scoped>
    @import ../../assets/sass/mixins-and-vars

    .error .cross
        stroke: $color-brand-light
</style>