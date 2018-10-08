<template>
    <div class="dialog">
        <div class="dialog__box">
            <div class="dialog__box__header">
                <img class="logo" src="../../assets/logo-arkane-animated.svg" alt="Logo Arkane">
                <div class="separator"></div>
            </div>
            <div class="dialog__box__content">
                <slot name="aboveTitle"></slot>
                <h3 class="dialog__box__title" v-if="title">{{title}}</h3>
                <slot>
                    <p>Description</p>
                </slot>
            </div>
        </div>
        <div class="dialog__footer" v-if="showFooter">
            <div class="dialog-poweredby">
            </div>
            <div>
                <action-link type="brand-light">Terms</action-link>
                <action-link type="brand-light">Privacy</action-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import ActionLink from '@/components/atoms/ActionLink.vue';
    import SvgArkane from '@/components/atoms/SvgArkane.vue';

    @Component({
    components: {
        ActionLink,
        SvgArkane,
    },
})
export default class DialogTemplate extends Vue {
    @Prop({default: true})
    public showFooter!: boolean;
    @Prop()
    public title!: string;
}
</script>

<style lang="sass" scoped>
    @import ../../assets/sass/mixins-and-vars

    .dialog-poweredby
        display: flex
        height: 100%
        align-items: center
        &__logo
            padding: rem(5px)
            height: 100%

    .dialog
        width: 100%
        max-width: rem(480px)

        &__box
            display: flex
            align-items: center
            flex-wrap: wrap
            width: 100%
            box-shadow: rem(0 2px 2px 0) rgba(0,0,0,0.14), rem(0 3px 1px -2px) rgba(0,0,0,0.12), rem(0 1px 5px 0) rgba(0,0,0,0.2)
            border-radius: $border-radius-small
            overflow: hidden
            background-color: $color-white

            &__header
                padding: rem(10px 0)
                text-align: center
                margin: 0
                width: 100%
                img
                    max-width: rem(140px)
            &__content
                padding: rem(0 50px 40px 50px)
                width: 100%
            &__title
                margin-top: 0
                text-align: center
            p
                line-height: $line-height-base
                text-align: justify
                &:last-of-type:not(.no-margin-bottom)
                    margin-bottom: rem(40px)
        &__footer
            width: 100%
            height: rem(32px)
            margin-bottom: rem(32px)
            display: flex
            align-items: center
            justify-content: space-between
            font-size: $font-size-xsmall
            font-weight: 400
            a
                text-decoration: none
                margin: rem(8px)
</style>