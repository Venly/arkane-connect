<template>
  <div class="container">
    <div class="dialog-container">

      <link-wallets-dialog v-if="showLinkWallet" :wallets="walletsForChainType" :chain="chain" :thirdPartylClientId="thirdPartyClientId"
                           @linkWalletsClicked="linkWallets" @createWalletClicked="toCreateWallet">
      </link-wallets-dialog>

      <redirect-dialog :class="'success'" :title="'Congratulations!'" :icon="'success'" :redirectUri="redirectUri" :timeleft="timeleft" v-if="showWalletsLinked">
        <p>The following wallets have been successfully linked to <strong>{{thirdPartyClientId}}</strong>:</p>
        <div class="wallets">
          <wallet-card :wallet="wallet" :showFunds="false" v-for="wallet in selectedWallets"></wallet-card>
        </div>
        <div class="no-margin-bottom">
          <action-button @click="redirectBack">Continue to ThorBlock ({{timeleft / 1000}})</action-button>
        </div>
      </redirect-dialog>

      <error-dialog v-if="showWalletsLinkedError" :title="'Something went wrong'" :buttonText="'Try Again'" @button-clicked="tryAgain">
        <p>Something went wrong while trying to link bellow wallets:</p>
        <div class="wallets">
          <wallet-card :wallet="wallet" :showFunds="false" v-for="wallet in selectedWallets"></wallet-card>
        </div>
        <p>Please try again. If the problem persists, contact support via <a href="mailto:support@arkane.network">support@arkane.network</a></p>
      </error-dialog>
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
    import {State, Getter} from 'vuex-class';
    import {AsyncData} from '@/decorators/decorators';
    import {SecretType} from '@/models/SecretType';
    import Utils from '../utils/Utils';
    import Api from '../api';
    import ResponseBody from '../api/ResponseBody';
    import LinkWalletsDialog from '../components/organisms/dialogs/LinkWalletsDialog.vue';
    import ErrorDialog from '../components/organisms/dialogs/ErrorDialog.vue';

    @Component({
                   components: {
                       ErrorDialog,
                       LinkWalletsDialog,
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
        @Getter
        private thirdPartyClientId!: string;

        private selectedWallets?: Wallet[];

        private showWalletsLinked: boolean = false;
        private showWalletsLinkedError: boolean = false;

        private timeleft = 5000;

        private redirectUri = '/';
        private interval!: any;

        public mounted(): void {
            this.redirectUri = (this.$route.query as any).redirectUri;
        }

        private get walletsForChainType() {
            return Utils.wallets.filterWalletsForChainType(this.wallets, this.chain);
        }

        private get showLinkWallet(): boolean {
            return !this.showWalletsLinked && !this.showWalletsLinkedError;
        }

        private async linkWallets(selectedWalletsDto: { wallets: Wallet[] }) {
            this.$store.dispatch('startLoading');
            Api.linkWallet({client: this.thirdPartyClientId, walletIds: selectedWalletsDto.wallets.map((wallet: Wallet) => wallet.id)})
               .then((response: ResponseBody) => {
                   if (response.success) {
                       this.showWalletsLinked = true;
                   } else {
                       this.showWalletsLinkedError = true;
                   }
                   this.selectedWallets = selectedWalletsDto.wallets;
                   this.$store.dispatch('stopLoading');
               })
               .catch((reason: any) => {
                   this.showWalletsLinkedError = true;
                   this.selectedWallets = selectedWalletsDto.wallets;
                   this.$store.dispatch('stopLoading');
               });
        }

        @Watch('showWalletsLinked')
        private onWalletsLinked(newValue: boolean, curValue: boolean) {
            if (newValue) {
                this.interval = setInterval(() => {
                    this.timeleft = this.timeleft - 1000;
                    if (this.timeleft <= 0) {
                        clearInterval(this.interval);
                    }
                }, 1000);
            }
        }

        private tryAgain() {
            this.showWalletsLinked = false;
            this.showWalletsLinkedError = false;
        }

        private toCreateWallet() {
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

  .link-button
    margin-bottom: 0
    margin-top: rem(20px)

  .separator
    margin: rem(30px 0)

  .success
    .wallet-card
      width: 100%
      margin-bottom: rem(10px)

</style>