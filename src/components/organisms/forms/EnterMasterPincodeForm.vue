<template>
  <form class="form">
    <div class="control" :class="{'control--error': $v.pincode.$error}">
      <input ref="pinInput" autofocus="autofocus" :id="`${_uid}-enter-pincode`" class="control__input" type="password" autocomplete="off"
             v-model="$v.pincode.$model" @keyup.enter="enterPincode"/>
      <span class="control__message" v-if="$v.pincode.$error">A Pin Code should exist of 4 to 6 numbers</span>
    </div>
    <div class="form__actions">
      <action-link :type="'muted'" @click.prevent="cancelClicked">Cancel</action-link>
      <action-button class="btn--inline" :disabled="$v.$invalid" @click.prevent="enterPincode">Continue</action-button>
    </div>
  </form>
</template>

<script lang='ts'>
import {Component, Emit, Vue} from 'vue-property-decorator';
import {validationMixin} from 'vuelidate';
import {maxLength, minLength, numeric, required} from 'vuelidate/lib/validators';
import {Validations} from '@/decorators/decorators';
import {pincode} from '@/validators/validators';

import ActionButton from '@/components/atoms/ActionButton.vue';
import ActionLink from '@/components/atoms/ActionLink.vue';

@Component({
    components: {
        ActionLink,
        ActionButton,
    },
    mixins: [validationMixin],
})
export default class EnterMasterPincodeForm extends Vue {

    public pincode = '';

    public mounted() {
        const pinInput = this.$refs.pinInput;
        if (pinInput) {
            (pinInput as HTMLElement).focus();
        }
    }

    public enterPincode(event: Event): void {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            this.$emit('done', this.pincode);
        }
    }

    @Emit('cancel')
    public cancelClicked() {
        // left blank intentionally
    }

    @Validations
    public validations(): any {
        return {
            pincode: {
                required,
                numeric,
                minLength: minLength(4),
                maxLength: maxLength(6),
            },
        };
    }
}
</script>


<style lang="sass" scoped>
  @import ../../../assets/sass/mixins-and-vars

  .form__actions
    display: flex
    align-items: baseline
    justify-content: space-between

    .btn,
    .link
      margin-bottom: 0
      width: rem(105px)

    .link
      text-align: left
      font-size: $font-size-small
      padding: 0

</style>