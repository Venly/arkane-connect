<template>
  <dialog-template :title="'Master Pin Code'">
    <p v-if="!hasMasterPin">You need a Master Pin Code to access Arkane securely and to perform transactions later on.</p>
    <p v-if="!hasMasterPin">Your Master Pin Code should be 4-6 numerical characters. Easy to remember - Hard to crack!</p>

    <p v-if="hasMasterPin">Update your Master Pin by first entering your existing Master Pin, and then choose a new one.</p>
    <set-master-pincode-form @done="pincodeSet"></set-master-pincode-form>
  </dialog-template>
</template>


<script lang="ts">
    import {Component, Emit, Vue} from 'vue-property-decorator';
    import SetMasterPincodeForm from '@/components/organisms/forms/SetMasterPincodeForm.vue';
    import DialogTemplate from '@/components/molecules/DialogTemplate.vue';
    import {State} from 'vuex-class';

    @Component({
        components: {
            DialogTemplate,
            SetMasterPincodeForm,
        },
    })
    export default class SetMasterPinDialog extends Vue {

        @State
        private hasMasterPin!: boolean;

        @Emit('done')
        public pincodeSet(pincode: string) {
            // let blank intentionally
        }
    }
</script>