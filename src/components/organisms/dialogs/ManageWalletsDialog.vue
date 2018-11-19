<template>
  <dialog-template :title="'Access to your wallets'">
    <p v-if="wallets.length <= 0" class="description no-margin-bottom">Create or import a wallet that application <strong>{{thirdPartyClientId}}</strong> is allowed to access:</p>
    <div v-if="wallets.length > 0">
      <link-wallets-form :wallets="wallets" :chain="chain" :thirdPartyClientId="thirdPartyClientId"
                         @linkWalletsClicked="linkWalletsClicked"
                         @linkedWalletsChanged="linkedWalletsChanged"></link-wallets-form>
      <div class="separator">
        <div class="separator__label">or</div>
      </div>
    </div>
    <div class="actions">
      <action-button @click="createWallet" :disabled="isLinkedWalletsChanged">Create a New Wallet</action-button>
      <div class="separator">
        <div class="separator__label">or</div>
      </div>
      <action-button class="margin-bottom" @click="importWallet" :disabled="isLinkedWalletsChanged">Import an Existing Wallet</action-button>
      <!--<div class="separator"></div>-->
      <action-link :type="'muted'" @click="backClicked">Back to {{thirdPartyClientId}}</action-link>
    </div>
  </dialog-template>
</template>

<script lang="ts">
    import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
    import WalletCard from '@/components/molecules/WalletCard.vue';
    import RedirectDialog from '@/components/organisms/dialogs/RedirectDialog.vue';
    import LinkWalletsForm from '@/components/organisms/forms/LinkWalletsForm.vue';
    import DialogTemplate from '@/components/molecules/DialogTemplate.vue';
    import ActionButton from '@/components/atoms/ActionButton.vue';
    import ActionLink from '@/components/atoms/ActionLink.vue';
    import {Wallet} from '../../../models/Wallet';
    import {AsyncData} from '@/decorators/decorators';
    import {SecretType} from '@/models/SecretType';
    import {Chain} from '../../../models/Chain';

    @Component({
        components: {
            LinkWalletsForm,
            ActionLink,
            ActionButton,
            RedirectDialog,
            DialogTemplate,
            WalletCard,
        },
    })
    export default class ManageWalletsDialog extends Vue {
        @Prop()
        private wallets!: Wallet[];
        @Prop()
        private thirdPartyClientId!: string;
        @Prop()
        private chain!: Chain;

        private isLinkedWalletsChanged: boolean = false;

        private linkedWalletsChanged(isLinkedWalletsChanged: boolean) {
            this.isLinkedWalletsChanged = isLinkedWalletsChanged;
        }

        private linkWalletsClicked(selectedWallets: Wallet[]) {
            this.$emit('linkWalletsClicked', {wallets: selectedWallets});
        }

        private createWallet() {
            this.$emit('createWalletClicked');
        }

        private importWallet() {
            this.$emit('importWalletClicked');
        }

        @Emit('backClicked')
        private backClicked() {
            // left blank intentionally
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

  .actions
    text-align: center

  .btn
    margin-bottom: 0
    &.margin-bottom
      margin-bottom: rem(15px)

  .separator
    margin: rem(15px 0)

  .link
    font-size: $font-size-small

</style>
