<template>
  <modal-template :title="'Master PIN Code Required'" :show="show" @close="cancel" @click.stop>
    <div class="description">To perform this action, please enter your master pin code.</div>
    <enter-master-pincode-form @done="pinEntered" @cancel="cancel"></enter-master-pincode-form>
  </modal-template>
</template>

<script lang="ts">
    import {Component, Emit, Prop, Vue} from 'vue-property-decorator';

    import ModalTemplate from '@/components/molecules/ModalTemplate.vue';
    import EnterMasterPincodeForm from '@/components/organisms/forms/EnterMasterPincodeForm.vue';

    @Component({
        components: {
            ModalTemplate,
            EnterMasterPincodeForm,
        },
    })
    export default class EnterMasterPinModal extends Vue {
        @Prop()
        public show!: boolean;
        @Prop()
        public title!: string;

        public pincode = '';

        public pinEntered(pincode: string) {
            this.$emit('done', pincode);
        }

        @Emit('cancel')
        public cancel() {
            // left blank intentionally
        }

        public close() {
            this.$emit('close');
        }
    }
</script>

<style lang="sass" scoped>
  @import ../../../assets/sass/mixins-and-vars

  .description
    margin-bottom: rem(15px)
</style>
