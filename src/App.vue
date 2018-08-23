<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<style lang="sass">
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
        text-align: center
        color: #4a4a4a
        padding: 40px 0
        @media (min-width: 380px)
            padding: 40px

</style>
