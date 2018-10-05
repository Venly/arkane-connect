<template>
  <div class="container" v-if="walletsForChainType.length > 0">
    <div class="dialog-container">

      <dialog-template v-if="showLinkWallet" :title="'Access to your wallets'">
        <form class="form">
          <div class="wallets">
            <div class="wallet-control" v-for="wallet in walletsForChainType">
                 <!--@click="walletSelected(wallet)">-->
              <div class="control control--checkbox">
                <input :ref="`wallet-${wallet.id}`" :id="`wallet-${wallet.id}`" :value="wallet" v-model="selectedWallets"
                       class="control__checkbox control__checkbox--check wallet-select" type="checkbox" @change="logWallets"/>
                <label class="control__label" :for="`wallet-${wallet.id}`"></label>
              </div>
              <wallet-card :wallet="wallet" :showFunds="false"></wallet-card>
            </div>
          </div>
          <action-button class="" :type="'brand-light'" @click="linkWallets">Link Wallets</action-button>
        </form>
        <div class="separator">
          <div class="separator__label">or</div>
        </div>
        <action-button @click="createWallet">Create a New Wallet</action-button>
      </dialog-template>

    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import WalletCard from '@/components/molecules/WalletCard.vue';
    import MasterPinDialog from '@/components/organisms/dialogs/MasterPinDialog.vue';
    import SetMasterPinDialog from '@/components/organisms/dialogs/SetMasterPinDialog.vue';
    import RedirectDialog from '@/components/organisms/dialogs/RedirectDialog.vue';
    import DialogTemplate from '@/components/molecules/DialogTemplate.vue';
    import ActionButton from '@/components/atoms/ActionButton.vue';
    import {Wallet} from '../models/Wallet';
    import {State} from 'vuex-class';
    import {AsyncData} from '@/decorators/decorators';
    import {SecretType} from '@/models/SecretType';
    import Utils from '../utils/Utils';

    @Component({
        components: {
            ActionButton,
            RedirectDialog,
            MasterPinDialog,
            SetMasterPinDialog,
            DialogTemplate,
            WalletCard,
        },
    })
    export default class LinkWalletView extends Vue {

        @State
        private wallets!: Wallet[];
        @State
        private chain!: string;

        private selectedWallets: Wallet[] = [];

        private timeleft = 5000;

        private redirectUri = '/';
        private interval!: any;

        public created() {
            if (!(this.wallets && this.wallets.length > 0)) {
                this.$router.replace({name: 'init', params: this.$route.params, query: this.$route.query});
            }
        }

        public mounted(): void {
            this.redirectUri = (this.$route.query as any).redirectUri;
        }

        public get walletsForChainType() {
            return Utils.wallets.filterWalletsForChainType(this.wallets, this.chain);
        }

        // private walletSelected(selectedWallet: Wallet) {
        //     if (this.selectedWallets.indexOf(selectedWallet) > -1) {
        //         this.selectedWallets = this.selectedWallets.filter((wallet: Wallet) => wallet.id != selectedWallet.id);
        //     } else {
        //         this.selectedWallets.push(selectedWallet);
        //     }
        // }

        private get showLinkWallet(): boolean {
            return true;
        }

        private async linkWallets(): Promise<Wallet> {
            // return this.$store.dispatch('createWallet', {secretType: this.secretType, masterPincode: pincode, clients: [this.thirdPartyClientId]});
            return new Wallet();
        }

        private createWallet() {
            this.$router.replace({name: 'create-wallet', params: this.$route.params, query: this.$route.query});
        }

        private redirectBack() {
            window.location.href = this.redirectUri;
        }
    }

</script>

<style lang="sass">
  @import ../assets/sass/mixins-and-vars

  body
    background-color: #fcfcfc

</style>
<style lang="sass" scoped>
  @import ../assets/sass/mixins-and-vars

  .container
    min-height: 100vh

  .dialog-container
    display: flex
    height: 100%
    justify-content: center
    align-items: center

  .wallets
    margin: rem(20px 0 20px 0)
    padding: rem(0 30px)
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
    max-width: calc(100% - #{rem(35px)})

  .control--checkbox
    margin-bottom: 0

  .separator
    margin: rem(30px 0)
</style>