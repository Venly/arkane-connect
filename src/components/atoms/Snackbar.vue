<template>
  <transition name="snackbar" mode="out-in">
    <div class="snackbar" :class="`snackbar--${snack.type}`" v-if="showSnack">
      <div class="snackbar__content">
        <div class="snackbar__message">{{snack.message}}</div>
        <div class="snackbar__close_window"><a ref="closeWindow" @click="closeWindow" tabindex="1" v-if="snack.blocking">Close window</a></div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {Snack} from '../../models/Snack';
    import {State} from 'vuex-class';

    declare const window: Window;

    @Component
    export default class Snackbar extends Vue {

        @State
        public snack!: Snack;

        public show = false;

        private get showSnack(): boolean {
            return this.snack && !(!this.snack.message) && this.snack.message !== '';
        }

        private closeWindow() {
            (window as any).close();
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
    z-index: 2
    padding: 7px 15px

    &--info
      background-color: $color-info
    &--danger
      background-color: $color-danger
    &--success
      background-color: $color-success

    &__content
      min-height: rem(32px)
      align-items: center
      color: white

    &__close_window
      float: right
      a
        text-decoration: underline
        color: white

    &-enter,
    &-leave-to
      opacity: 0
      transform: translateY(-100%)

    &-leave,
    &-enter-to
      opacity: 1
      transform: translateY(0%)

    &-enter-active
      transition: all 300ms ease-out

    &-leave-active
      transition: all 300ms ease-in

</style>
