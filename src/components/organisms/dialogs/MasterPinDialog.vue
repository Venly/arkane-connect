<template>
    <dialog-template :title="'Master Pin Code'">
        <p v-if="!hasMasterPin">You need a Master Pin Code to access Arkane securely and to perform transactions later on.</p>
        <p v-if="!hasMasterPin">Your Master Pin Code should be 4-6 numerical characters. Easy to remember - Hard to crack!</p>

        <p v-if="hasMasterPin">Update your Master Pin by first entering your existing Master Pin, and then choose a new one.</p>
        <master-pincode-form @done="pinUpdated"></master-pincode-form>
    </dialog-template>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
import MasterPincodeForm from '@/components/organisms/forms/MasterPincodeForm.vue';
import DialogTemplate from '@/components/molecules/DialogTemplate.vue';
import {State} from 'vuex-class';

@Component({
    components: {
        DialogTemplate,
        MasterPincodeForm,
    },
})
export default class MasterPinDialog extends Vue {
    @Prop()
    public chain!: string;

    @State('userState.hasMasterPin')
    private hasMasterPin!: boolean;

    @Emit('done')
    public pinUpdated(pincode: string) {
        // let blank intentionally
    }
}
</script>