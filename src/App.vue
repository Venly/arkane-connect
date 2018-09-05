<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<style lang="sass">
    @import ./assets/sass/main
</style>

<style lang="sass">
    @import ./assets/sass/mixins-and-vars

    html
        box-sizing: border-box

        *, *::before, *::after
            box-sizing: inherit

        html, body
            padding: 0
            margin: 0

        #app
            font-family: Roboto, Helvetica, Arial, sans-serif
            -webkit-font-smoothing: antialiased
            -moz-osx-font-smoothing: grayscale
            color: $color-text
</style>
