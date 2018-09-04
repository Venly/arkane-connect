<template>
    <svg viewBox="0 0 300 300">
        <polyline fill="none"
                  class="check"
                  stroke="white"
                  stroke-width="50px"
                  stroke-dasharray="1000"
                  stroke-dashoffset="0"
                  stroke-linecap="round"
                  points="25, 150 125,250 275,25">
            <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="700ms" fill="freeze"></animate>
        </polyline>
    </svg>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class SvgCheckmark extends Vue {
    }
</script>

<style lang="sass" scoped>

    .success .check
        stroke: green
</style>