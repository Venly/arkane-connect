<template>
    <div id="app" class="page">
        <progress-bar></progress-bar>
        <snackbar class="snackbar snackbar--header"></snackbar>
        <router-view/>
    </div>
</template>
<script lang='ts'>
    import Vue from 'vue';
    import {Component} from 'vue-property-decorator';
    import ProgressBar from './components/atoms/ProgressBar.vue';
    import Snackbar from './components/atoms/Snackbar.vue';

    @Component({
        components: {
            Snackbar,
            ProgressBar,
        },
    })
    export default class App extends Vue {
    }
</script>

<style lang="sass">
    @import ./assets/sass/main
    @import ./assets/sass/mixins-and-vars

    html
        box-sizing: border-box

        *, *::before, *::after
            box-sizing: inherit

        html, body
            padding: 0
            margin: 0
</style>