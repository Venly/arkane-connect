<template>
    <form class="form">
        <div class="control" :class="{'control--error': $v.pincode.$error}">
            <label for="pincode" class="control__label">Master Pin Code</label>
            <input tabindex="1" id="pincode" autofocus class="control__input" type="password" autocomplete="new-password"
                   v-model="$v.pincode.$model"/>
            <span class="control__message"
                  v-if="$v.pincode.$error">A Pin Code should exist of 4 to 6 numbers</span>
        </div>
        <action-button :disabled="$v.$invalid" @click.prevent="pincodeEntered">
            {{createLabel}}
        </action-button>

    </form>
</template>

<script lang='ts'>
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {validationMixin} from 'vuelidate';
    import {maxLength, minLength, numeric} from 'vuelidate/lib/validators';
    import {Validations} from '@/decorators/decorators';
    import ActionButton from '@/components/atoms/ActionButton.vue';
    import {differentFrom} from '@/validators/validators';

    @Component({
        components: {
            ActionButton,
        },
        mixins: [validationMixin],
    })
    export default class MasterPincodeForm extends Vue {

        @Prop()
        public createLabel!: string;

        public pincode = '';

        @Validations
        public validations(): any {
            return {
                pincode: {
                    numeric,
                    minLength: minLength(4),
                    maxLength: maxLength(6),
                },
            };
        }

        public async pincodeEntered(event: Event): Promise<void> {
            this.$v.$touch();
            if (!this.$v.$invalid) {
                this.$emit('done', this.pincode);
            }
        }
    }
</script>