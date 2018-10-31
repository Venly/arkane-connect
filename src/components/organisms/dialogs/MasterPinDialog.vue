<template>
  <dialog-template :title="title">
    <slot></slot>
    <master-pincode-form @done="pinEntered" @back="backClicked" :create-label="actionLabel"></master-pincode-form>
  </dialog-template>
</template>

<script lang="ts">
    import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
    import MasterPincodeForm from '@/components/organisms/forms/MasterPincodeForm.vue';
    import DialogTemplate from '@/components/molecules/DialogTemplate.vue';

    @Component({
        components: {
            DialogTemplate,
            MasterPincodeForm,
        },
    })
    export default class MasterPinDialog extends Vue {
        @Prop()
        public title!: string;
        @Prop()
        public actionLabel!: string;

        @Emit('done')
        public pinEntered(pincode: string) {
            // left blank intentionally
        }

        @Emit('back')
        public backClicked() {
            // left blank intentionally
        }
    }
</script>