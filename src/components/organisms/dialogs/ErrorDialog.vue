<template>
  <dialog-template :title="'Something went wrong'">
    <template slot="aboveTitle">
      <div class="icon-wrapper">
        <svg-cross class="error"></svg-cross>
      </div>
    </template>
    <div class="message">
      <slot></slot>
    </div>
    <div>
      <action-button @click="$emit('button-clicked')">{{buttonText}}</action-button>
    </div>
  </dialog-template>
</template>
<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import DialogTemplate from '@/components/molecules/DialogTemplate.vue';
    import SvgCross from '@/components/atoms/SvgCross.vue';
    import ActionButton from '@/components/atoms/ActionButton.vue';

    @Component({
                   components: {
                       ActionButton,
                       SvgCross,
                       DialogTemplate,
                   },
               })
    export default class ErrorDialog extends Vue {

        @Prop()
        public title!: string;
        @Prop()
        public buttonText!: string;
    }
</script>
<style lang="sass" scoped>
  @import "../../../assets/sass/mixins-and-vars"

  .message
    word-break: break-word

  .icon-wrapper
    height: rem(50px)
    margin-bottom: 20px
    > svg
      max-width: 100%
      max-height: 100%
</style>