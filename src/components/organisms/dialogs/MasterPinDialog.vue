<template>
    <dialog-template :title="title">
        <slot></slot>
        <master-pincode-form @done="pinEntered" :create-label="'Create Wallet'"></master-pincode-form>
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

        @Emit('done')
        public pinEntered(pincode: string) {
            // let blank intentionally
        }
    }
</script>