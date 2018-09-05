<template>
    <div class="dialog">
        <div class="dialog__content">
            <slot name="aboveTitle"></slot>
            <h3 class="dialog__title" v-if="title">{{title}}</h3>
            <slot>
                <p>
                    Description
                </p>
            </slot>
        </div>
        <div class="dialog__footer" v-if="showFooter">
            <div class="dialog-poweredby">
                <span>Powered by</span>
                <svg-arkane class="dialog-poweredby__logo"></svg-arkane>
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
        display: flex
        align-items: center
        flex-wrap: wrap

        grid-column: 2 / span 10
        @include media(tablet)
            grid-column: 4 / span 6
        @include media(wide)
            grid-column: 5 / span 4

        &__content
            margin-top: rem(32px)
            background-color: $color-white
            box-shadow: rem(0 2px 4px 0) rgba(0, 0, 0, 0.5)
            border-radius: $border-radius-small
            padding: rem(40px 50px)
        &__title
            margin-top: 0
            text-align: center
        p
            line-height: $line-height-base
            text-align: justify
            margin-bottom: rem(40px)
        &__footer
            height: rem(32px)
            margin-bottom: rem(32px)
            display: flex
            align-items: center
            justify-content: space-between
            font-size: $font-size-xsmall

            a
                margin: rem(8px)
</style>