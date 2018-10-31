<template>
  <form class="form">
    <div class="control" :class="{'control--error': $v.pincode.$error}">
      <label for="pincode" class="control__label">Master Pin Code</label>
      <input tabindex="1" id="pincode" autofocus class="control__input" type="password" autocomplete="new-password"
             v-model="$v.pincode.$model"/>
      <span class="control__message"
            v-if="$v.pincode.$error">A Pin Code should exist of 4 to 6 numbers</span>
    </div>
    <div class="actions">
      <action-link class="back" @click.prevent="backClicked">&lt; Back</action-link>
      <action-button :type="'brand-light'" class="pincode-entered" :disabled="$v.$invalid" @click.prevent="pincodeEntered">
        {{createLabel}}
      </action-button>
    </div>

  </form>
</template>

<script lang='ts'>
    import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
    import {validationMixin} from 'vuelidate';
    import {maxLength, minLength, numeric} from 'vuelidate/lib/validators';
    import {Validations} from '@/decorators/decorators';
    import ActionButton from '@/components/atoms/ActionButton.vue';
    import ActionLink from '@/components/atoms/ActionLink.vue';
    import {differentFrom} from '@/validators/validators';

    @Component({
        components: {
            ActionLink,
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
                    required: true,
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

        @Emit('back')
        public backClicked() {
            // left blank intentionally
        }
    }
</script>

<style lang="sass" scoped>
  @import ../../../assets/sass/mixins-and-vars

  .actions
    display: flex
    justify-content: space-between
    align-items: center

    .pincode-entered,
    .back
      width: 45%
      margin-bottom: 0

</style>