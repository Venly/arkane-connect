<template>
    <transition name="snackbar" mode="out-in">
        <div class="snackbar" :class="`snackbar--${snack.type}`" v-if="showSnack">
                <div class="snackbar__content">
                    <div class="snackbar__message">{{snack.message}}</div>
                </div>
            </div>
    </transition>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import {Snack} from '@/models/Snack';
import {State} from 'vuex-class';

@Component
export default class Snackbar extends Vue {

    @State
    public snack!: Snack;

    public show = false;

    private get showSnack(): boolean {
        return this.snack && !(!this.snack.message) && this.snack.message !== '';
    }
}
</script>

<style lang="sass" scoped>
    @import ../../assets/sass/mixins-and-vars

    .snackbar
        background-color: $color-info
        display: block
        font-weight: $font-weight-bold
        font-size: $font-size-regular
        width: 100%
        position: absolute

        &--info
            background-color: $color-info
        &--danger
            background-color: $color-danger
        &--success
            background-color: $color-success

    .snackbar__content
        display: flex
        min-height: rem(32px)
        align-items: center
        justify-content: center
        color: white
        padding: 7px 15px

    .snackbar-enter,
    .snackbar-leave-to
        opacity: 0
        transform: translateY(-100%)

    .snackbar-leave,
    .snackbar-enter-to
        opacity: 1
        transform: translateY(0%)

    .snackbar-enter-active
        transition: all 300ms ease-out

    .snackbar-leave-active
        transition: all 300ms ease-in

</style>
