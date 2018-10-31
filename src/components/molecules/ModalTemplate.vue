<template>
  <transition name="modal">
    <div class="modal-mask" v-if="show">
      <div class="modal" @click.stop v-on-clickaway="close">
        <div class="modal__content">
          <slot name="aboveTitle"></slot>
          <h3 class="modal__title" v-if="title">{{title}}</h3>
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {directive as onClickaway} from 'vue-clickaway';

    import ActionLink from '@/components/atoms/ActionLink.vue';
    import SvgArkane from '@/components/atoms/SvgArkane.vue';

    @Component({
        components: {
            ActionLink,
            SvgArkane,
        },
        directives: {onClickaway},
    })
    export default class ModalTemplate extends Vue {
        @Prop()
        public title!: string;
        @Prop()
        public show!: boolean;

        public beforeMount() {
            document.addEventListener('keyup', this.onEscapeKeyUp);
        }

        public beforeDestroy() {
            document.removeEventListener('keyup', this.onEscapeKeyUp);
        }

        public onEscapeKeyUp(event: any) {
            if (event.which === 27) {
                this.close();
            }
        }

        public close() {
            this.$emit('close');
        }
    }
</script>

<style lang="sass" scoped>
  @import ../../assets/sass/mixins-and-vars

  .modal-mask
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 99999
    background: rgba($color-black, .5)
    transition: opacity .3s ease-out
    display: flex
    justify-content: center
    align-items: center
    cursor: default

  .modal
    width: 100%
    max-width: rem(320px)
    margin: rem(32px)
    color: $color-text
    white-space: normal
    text-align: center
    font-size: $font-size-regular
    font-weight: $font-weight-normal

    &__content
      background-color: $color-white
      box-shadow: rem(0 2px 4px 0) rgba(0, 0, 0, 0.5)
      border-radius: $border-radius-small
      padding: rem(30px 40px)
    &__title
      margin-top: 0
      text-align: center
      font-size: $font-size-big
    p
      line-height: $line-height-base
      text-align: justify
      margin-bottom: rem(40px)

  .modal-enter
    opacity: 0

  .modal-leave-active
    opacity: 0

  .modal-enter .modal-container,
  .modal-leave-active .modal-container
    -webkit-transform: scale(1.1)
    transform: scale(1.1)

</style>
