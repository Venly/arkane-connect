<template>
    <form class="form">
        <div class="control" :class="{'control--error': $v.oldPincode.$error}" v-if="hasMasterPin">
            <label for="oldPincode" class="control__label">Master Pin Code</label>
            <input tabindex="1" id="oldPincode" class="control__input" type="password" autocomplete="new-password"
                   v-model="$v.oldPincode.$model"/>
            <span class="control__message"
                  v-if="$v.oldPincode.$error">A Pin Code should exist of 4 to 6 numbers</span>
        </div>
        <div class="control" :class="{'control--error': $v.pincode.$error}">
            <label for="pincode" class="control__label">New Master Pin Code</label>
            <input tabindex="2" id="pincode" class="control__input" type="password" autocomplete="new-password"
                   v-model="$v.pincode.$model"/>
            <span class="control__message"
                  v-if="$v.pincode.$error && !$v.pincode.differentFromOldPincode">New Pin Code cannot be the same as the old Pin Code</span>
            <span class="control__message"
                  v-else-if="$v.pincode.$error">A Pin Code should exist of 4 to 6 numbers</span>
        </div>
        <div class="control" :class="{'control--error': $v.pincodeConfirm.$error}">
            <label for="pincode-repeat" class="control__label">Confirm New Master Pin Code</label>
            <input tabindex="3" id="pincode-repeat" class="control__input" type="password"
                   v-model="$v.pincodeConfirm.$model"
                   autocomplete="new-password"/>
            <span class="control__message"
                  v-if="$v.pincodeConfirm.$error">You made a boo-boo, please enter the same Pin Code again</span>
        </div>
        <action-button :disabled="$v.$invalid" @click.prevent="setPincode">
            Save Pin
        </action-button>

    </form>
</template>

<script lang='ts'>
    import {Component, Vue} from 'vue-property-decorator';
    import {validationMixin} from 'vuelidate';
    import {maxLength, minLength, numeric, required, sameAs} from 'vuelidate/lib/validators';
    import {Validations} from '@/decorators/decorators';
    import ActionButton from '@/components/atoms/ActionButton.vue';
    import {differentFrom} from '@/validators/validators';
    import {State} from 'vuex-class';

    /**
     * Fires 'change' event after Master Pin Code is set
     */
    @Component({
        components: {
            ActionButton,
        },
        mixins: [validationMixin],
    })
    export default class SetMasterPincodeForm extends Vue {

        public oldPincode = '';
        public pincode = '';
        public pincodeConfirm = '';

        @State
        private hasMasterPin!: boolean;

        @Validations
        public validations(): any {
            return {
                oldPincode: {
                    required: this.hasMasterPin ? required : () => true,
                    numeric,
                    minLength: minLength(4),
                    maxLength: maxLength(6),
                },
                pincode: {
                    required,
                    numeric,
                    minLength: minLength(4),
                    maxLength: maxLength(6),
                    differentFromOldPincode: this.hasMasterPin ? differentFrom('oldPincode') : () => true,
                },
                pincodeConfirm: {
                    required,
                    sameAsPincode: sameAs('pincode'),
                },
            };
        }

        public async setPincode(event: Event): Promise<void> {
            this.$v.$touch();
            if (!this.$v.$invalid) {
                let success = false;
                if (this.hasMasterPin) {
                    success = await this.$store.dispatch('updateMasterPin', {oldPincode: this.oldPincode, pincode: this.pincode});
                } else {
                    success = await this.$store.dispatch('setMasterPin', this.pincode);
                }
                if (success) {
                    this.$emit('done', this.pincode);
                }
            }
        }
    }
</script>