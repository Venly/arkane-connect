<template>
    <div class="about">
        <h1>Initializing...</h1>
    </div>
</template>


<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class InitTransactionView extends Vue {
        public mounted(): void {
            this.$store.dispatch('startLoading');
        }

    }
</script>