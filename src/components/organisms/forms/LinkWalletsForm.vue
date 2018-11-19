<template>
  <div>
    <p class="description no-margin-bottom">Select the <strong>{{chain.name}}</strong> wallets that application <strong>{{thirdPartyClientId}}</strong> is allowed to access:</p>
    <form class="form">
      <div class="wallets">
        <div class="wallet-control" v-for="wallet in wallets">
          <div class="control control--checkbox">
            <input :ref="`wallet-${wallet.id}`" :id="`wallet-${wallet.id}`" :value="wallet" v-model="selectedWallets"
                   class="control__checkbox control__checkbox--check wallet-select" type="checkbox"/>
            <label class="control__label" :for="`wallet-${wallet.id}`"></label>
          </div>
          <wallet-card :wallet="wallet" :showFunds="false" @click="walletSelected(wallet)" :inline="walletsInline"></wallet-card>
        </div>
      </div>
    </form>
    <div class="select-all">
      <action-link type="brand-light" @click="selectAll" v-if="!isAllSelected">Select all</action-link>
      <action-link type="brand-light" @click="deselectAll" v-if="isAllSelected">Deselect all</action-link>
    </div>
    <action-button :type="'brand-light'"
                   @click="linkWallets"
                   :disabled="selectedWallets.length <= 0"
                   :title="selectedWallets.length <= 0 ? 'At least one wallet needs to be selected' : ''">Update Linked Wallets
    </action-button>
  </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {Chain} from '../../../models/Chain';
    import {Wallet} from '../../../models/Wallet';
    import Api from '../../../api';
    import WalletCard from '@/components/molecules/WalletCard.vue';
    import ActionButton from '@/components/atoms/ActionButton.vue';
    import ActionLink from '@/components/atoms/ActionLink.vue';

    @Component({
        components: {ActionLink, ActionButton, WalletCard},
    })
    export default class LinkWalletsForm extends Vue {
        @Prop()
        private wallets!: Wallet[];
        @Prop()
        private chain!: Chain;
        @Prop()
        private thirdPartyClientId!: string;
        @Prop({required: false, default: false})
        private walletsInline!: boolean;


        private selectedWallets: Wallet[] = [];
        private originalSelectedWalletIds: string[] = [];

        public async mounted() {
            this.selectedWallets = await Api.getWallets({secretType: this.chain.secretType, clientId: this.thirdPartyClientId});
            this.originalSelectedWalletIds = this.selectedWallets.map((wallet: Wallet) => wallet.id);
        }

        public get isLinkedWalletsChanged(): boolean {
            return this.selectedWallets.length !== this.originalSelectedWalletIds.length
                || (this.selectedWalletsIds.filter((sw) => this.originalSelectedWalletIds.indexOf(sw) === -1).length > 0);
        }

        private get selectedWalletsIds(): string[] {
            return this.selectedWallets.map((wallet: Wallet) => wallet.id);
        }

        private get isAllSelected(): boolean {
            return this.selectedWallets.length === this.wallets.length;
        }

        private selectAll() {
            this.selectedWallets = this.wallets;
        }

        private deselectAll() {
            this.selectedWallets = [];
        }

        private walletSelected(selectedWallet: Wallet) {
            if (this.isAlreadySelected(selectedWallet)) {
                this.deselectWallet(selectedWallet);
            } else {
                this.selectWallet(selectedWallet);
            }
        }

        @Watch('selectedWallets')
        private selectedWalletsChanged() {
            this.$emit('linkedWalletsChanged', this.isLinkedWalletsChanged);
        }

        private isAlreadySelected(selectedWallet: Wallet) {
            return this.selectedWallets.filter((wallet: Wallet) => wallet.id === selectedWallet.id).length > 0;
        }

        private deselectWallet(selectedWallet: Wallet) {
            this.selectedWallets = this.selectedWallets.filter((wallet: Wallet) => wallet.id !== selectedWallet.id);
        }

        private selectWallet(selectedWallet: Wallet) {
            this.selectedWallets.push(selectedWallet);
        }

        private linkWallets() {
            this.$emit('linkWalletsClicked', this.selectedWallets);
        }
    }
</script>

<style lang="sass" scoped>
  @import ../../../assets/sass/mixins-and-vars

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

  .btn
    margin-bottom: 0
    &.margin-bottom
      margin-bottom: rem(15px)

  .select-all
    font-size: $font-size-small
    margin-bottom: rem(10px)
</style>