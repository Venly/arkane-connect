<template>
  <dialog-template :title="'Access to your wallets'">
    <p v-if="wallets.length <= 0" class="description no-margin-bottom">Create or import a wallet that application <strong>{{thirdPartyClientId}}</strong> is allowed to access:</p>
    <div v-if="wallets.length > 0">
      <p class="description no-margin-bottom">Select the <strong>{{chain.name}}</strong> wallets that application <strong>{{thirdPartyClientId}}</strong> is allowed to access:</p>
      <form class="form">
        <div class="wallets">
          <div class="wallet-control" v-for="wallet in wallets">
            <div class="control control--checkbox">
              <input :ref="`wallet-${wallet.id}`" :id="`wallet-${wallet.id}`" :value="wallet" v-model="selectedWallets"
                     class="control__checkbox control__checkbox--check wallet-select" type="checkbox"/>
              <label class="control__label" :for="`wallet-${wallet.id}`"></label>
            </div>
            <wallet-card :wallet="wallet" :showFunds="false" @click="walletSelected(wallet)"></wallet-card>
          </div>
        </div>
      </form>
      <action-button :type="'brand-light'"
                     @click="linkWallets"
                     :disabled="selectedWallets.length <= 0"
                     :title="selectedWallets.length <= 0 ? 'At least one wallet needs to be selected' : ''">Update Linked Wallets
      </action-button>
      <div class="separator">
        <div class="separator__label">or</div>
      </div>
    </div>
    <div class="actions">
      <action-button @click="createWallet" :disabled="linkedWalletsChanged">Create a New Wallet</action-button>
      <div class="separator">
        <div class="separator__label">or</div>
      </div>
      <action-button class="margin-bottom" @click="importWallet" :disabled="linkedWalletsChanged">Import an Existing Wallet</action-button>
      <!--<div class="separator"></div>-->
      <action-link @click="backClicked" :disabled="linkedWalletsChanged">Back to {{thirdPartyClientId}}</action-link>
    </div>
  </dialog-template>
</template>

<script lang="ts">
    import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
    import WalletCard from '@/components/molecules/WalletCard.vue';
    import MasterPinDialog from '@/components/organisms/dialogs/MasterPinDialog.vue';
    import SetMasterPinDialog from '@/components/organisms/dialogs/SetMasterPinDialog.vue';
    import RedirectDialog from '@/components/organisms/dialogs/RedirectDialog.vue';
    import DialogTemplate from '@/components/molecules/DialogTemplate.vue';
    import ActionButton from '@/components/atoms/ActionButton.vue';
    import ActionLink from '@/components/atoms/ActionLink.vue';
    import {Wallet} from '../../../models/Wallet';
    import {AsyncData} from '@/decorators/decorators';
    import {SecretType} from '@/models/SecretType';
    import Api from '../../../api';
    import {Chain} from '../../../models/Chain';

    @Component({
        components: {
            ActionLink,
            ActionButton,
            RedirectDialog,
            MasterPinDialog,
            SetMasterPinDialog,
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

        private selectedWallets: Wallet[] = [];
        private originalSelectedWalletIds: string[] = [];

        public async mounted() {
            this.selectedWallets = await Api.getWallets({secretType: this.chain.secretType, clientId: this.thirdPartyClientId});
            this.originalSelectedWalletIds = this.selectedWallets.map((wallet: Wallet) => wallet.id);
        }

        public get linkedWalletsChanged(): boolean {
            return this.selectedWallets.length !== this.originalSelectedWalletIds.length
                || (this.selectedWalletsIds.filter((sw) => this.originalSelectedWalletIds.indexOf(sw) === -1).length > 0);
        }

        @Emit('backClicked')
        public backClicked() {
            // left blank intentionally
        }

        private get selectedWalletsIds(): string[] {
            return this.selectedWallets.map((wallet: Wallet) => wallet.id);
        }

        private walletSelected(selectedWallet: Wallet) {
            if (this.selectedWallets.filter((wallet: Wallet) => wallet.id === selectedWallet.id).length > 0) {
                this.selectedWallets = this.selectedWallets.filter((wallet: Wallet) => wallet.id !== selectedWallet.id);
            } else {
                this.selectedWallets.push(selectedWallet);
            }
        }

        private linkWallets() {
            this.$emit('linkWalletsClicked', {wallets: this.selectedWallets});
        }

        private createWallet() {
            this.$emit('createWalletClicked');
        }

        private importWallet() {
            this.$emit('importWalletClicked');
        }
    }
</script>
<style lang="sass" scoped>
  @import "../../../assets/sass/mixins-and-vars"

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

  .control--checkbox
    margin-bottom: 0

  .actions
    text-align: center

  .btn
    margin-bottom: 0
    &.margin-bottom
      margin-bottom: rem(30px)

  .separator
    margin: rem(15px 0)

</style>
