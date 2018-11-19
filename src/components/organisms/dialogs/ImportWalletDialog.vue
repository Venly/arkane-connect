<template>
  <dialog-template :title="'Import a wallet'">
    <p class="description no-margin-bottom">Import a <strong>{{chainName}}</strong> wallet that application <strong>{{thirdPartyClientId}}</strong> is allowed to access:</p>

    <form class="form" autocomplete="off" v-if="chain.importWalletType === 'ETHEREUM_PRIVATE_KEY'">
      <div class="control" :class="{'control--error': $v.privateKey.$error}">
        <label for="privateKey" class="control__label">Private Key</label>
        <input tabindex="1" id="privateKey" class="control__input" type="password" v-model="$v.privateKey.$model"
               :placeholder="`Enter the private key of your ${chainName} wallet here`"/>
        <span class="control__message" v-if="$v.privateKey.$error">This is not a valid private key</span>
      </div>
      <div class="actions">
        <action-link :type="'muted'" @click.prevent="backClicked">Back</action-link>
        <action-button tabindex="2" :type="'brand-light'" :disabled="$v.$invalid" @click.prevent="importPrivateKey">Import {{chainName}} wallet</action-button>
      </div>
    </form>

    <form class="form" autocomplete="off" v-if="chain.importWalletType === 'VECHAIN_KEYSTORE'">
      <div class="control" :class="{'control--error': $v.keystore.$error}">
        <label for="keystore" class="control__label">Keystore</label>
        <textarea tabindex="1" id="keystore" class="control__input" v-model="$v.keystore.$model" :placeholder="`Enter the keystore of your ${chainName} wallet here`"></textarea>
        <span class="control__message" v-if="$v.keystore.$error">The keystore is required</span>
      </div>
      <div class="control" :class="{'control--error': $v.keystorePassword.$error}">
        <label for="keystorePassword" class="control__label">Keystore Password</label>
        <input tabindex="2" id="keystorePassword" class="control__input" type="password" v-model="$v.keystorePassword.$model"
               :placeholder="`Enter the password of this keystore`"/>
        <span class="control__message" v-if="$v.keystorePassword.$error">The keystore password is required</span>
      </div>
      <div class="actions">
        <action-link :type="'muted'" @click.prevent="backClicked">Back</action-link>
        <action-button tabindex="3" :disabled="$v.$invalid" @click.prevent="importKeystore">Import {{chainName}} wallet</action-button>
      </div>
    </form>
  </dialog-template>
</template>

<script lang="ts">
    import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
    import {validationMixin} from 'vuelidate';
    import WalletCard from '../../molecules/WalletCard.vue';
    import RedirectDialog from '../../organisms/dialogs/RedirectDialog.vue';
    import DialogTemplate from '../../molecules/DialogTemplate.vue';
    import ActionButton from '../../atoms/ActionButton.vue';
    import ActionLink from '../../atoms/ActionLink.vue';
    import {Validations} from '../../../decorators/decorators';
    import {requiredIf} from '../../../validators/validators';
    import {Chain} from '../../../models/Chain';
    import {State} from 'vuex-class';

    @Component({
        components: {
            ActionLink,
            ActionButton,
            RedirectDialog,
            DialogTemplate,
            WalletCard,
        },
        mixins: [validationMixin],
    })
    export default class ImportWalletDialog extends Vue {
        @State
        private chain!: Chain;

        @Prop()
        private thirdPartyClientId!: string;

        private privateKey: string = '';
        private keystore: string = '';
        private keystorePassword: string = '';

        public get chainName() {
            return this.chain.name;
        }

        public get usePrivateKey() {
            return this.chain.importWalletType === 'ETHEREUM_PRIVATE_KEY';
        }

        public get useKeystore() {
            return this.chain.importWalletType === 'VECHAIN_KEYSTORE';
        }

        public importPrivateKey() {
            this.$emit('importPrivateKeyClicked', this.privateKey);
        }

        public importKeystore() {
            this.$emit('importKeystoreClicked', this.keystore, this.keystorePassword);
        }

        @Emit('backClicked')
        public backClicked() {
            // left blank intentionally
        }

        @Validations
        public validations(): any {
            return {
                privateKey: {
                    required: requiredIf(() => this.usePrivateKey),
                },
                keystore: {
                    required: requiredIf(() => this.useKeystore),
                },
                keystorePassword: {
                    required: requiredIf(() => this.useKeystore),
                },
            };
        }
    }
</script>
<style lang="sass" scoped>
  @import ../../../assets/sass/mixins-and-vars

  .container
    min-height: 100vh

  .dialog-container
    display: flex
    height: 100%
    justify-content: center
    align-items: center

  .wallets
    margin: rem(20px 0 20px 0)
    padding: rem(0 10px)
    max-height: rem(300px)
    overflow-y: auto
    overflow-x: hidden

  .wallet-control
    display: flex
    align-items: center
    margin: rem(20px 0)
    &:first-child
      margin-top: 0

  .wallet-card
    width: calc(100% - #{rem(35px)})
    cursor: pointer

  textarea
    height: rem(150px)

  .control--checkbox
    margin-bottom: 0

  .button
    margin-bottom: 0
    &:last-of-type
      margin-bottom: rem(20px)

  .separator
    margin: rem(15px 0)

  .actions
    display: flex
    justify-content: space-between
    align-items: baseline

    .btn,
    .link
      margin-bottom: 0

    .link
      width: rem(100px)
      text-align: left
      font-size: $font-size-small
      padding: 0
</style>
