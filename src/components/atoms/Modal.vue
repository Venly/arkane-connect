<template>
  <div ref="modal" class="modal" v-bind:style="{ display: displayModal}"></div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {Snack} from '@/models/Snack';
    import {State} from 'vuex-class';

    @Component
    export default class Modal extends Vue {

        @State
        public showModal!: boolean;

        private get displayModal() {
          return this.showModal ? 'block' : 'none';
        }

        @Watch('showModal')
        private watchShowModal(oldShowModal: boolean, newShowModal: boolean) {
            if (newShowModal) {
                (this.$refs.modal as HTMLElement).focus();
            }
        }
    }
</script>

<style lang="sass" scoped>

  .modal
    position: fixed
    z-index: 1
    left: 0
    top: 0
    width: 100%
    height: 100%
    overflow: auto
    background: rgb(0, 0, 0)
    background: transparent \9
    background: rgba(0, 0, 0, 0.4)
</style>
