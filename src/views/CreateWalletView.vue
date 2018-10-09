<template>
  <div class="container">
    <div class="dialog-container">

      <set-master-pin-dialog @done="masterpinEntered" v-if="showSetupMasterPin"></set-master-pin-dialog>

      <master-pin-dialog :title="'Create a wallet'" @done="masterpinEntered" v-if="showEnterMasterPin">
        <p>Please confirm by providing your Master Pin Code</p>
      </master-pin-dialog>

      <dialog-template v-if="showCreatingWallet" :title="'Creating wallet'">
        <p>A <strong>{{chain}}</strong> wallet is being created...</p>
      </dialog-template>

      <redirect-dialog :title="'Congratulations!'" :icon="'success'" :redirectUri="redirectUri" :timeleft="timeleft" v-if="showWalletCreated">
        <p>A {{chain}} wallet with the following address has been created and linked to your <strong>{{thirdPartyClientId}}</strong> account:</p>
        <p>
          <wallet-card :wallet="wallet" :showFunds="false"></wallet-card>
        </p>
        <div>
          <action-button @click="redirectBack">Continue to {{thirdPartyClientId}} ({{timeleft / 1000}})</action-button>
        </div>
      </redirect-dialog>

      <error-dialog v-if="showWalletCreationFailed" :title="'Something went wrong'" :buttonText="'Try Again'" @button-clicked="tryAgain">
        <p>Something went wrong while trying to create your {{chain}} wallet.</p>
        <p>Please try again. If the problem persists, contact support via <a href="mailto:support@arkane.network">support@arkane.network</a></p>
      </error-dialog>
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import WalletCard from '@/components/molecules/WalletCard.vue';
    import MasterPinDialog from '@/components/organisms/dialogs/MasterPinDialog.vue';
    import SetMasterPinDialog from '@/components/organisms/dialogs/SetMasterPinDialog.vue';
    import RedirectDialog from '@/components/organisms/dialogs/RedirectDialog.vue';
    import DialogTemplate from '@/components/molecules/DialogTemplate.vue';
    import ActionButton from '@/components/atoms/ActionButton.vue';
    import {Wallet} from '../models/Wallet';
    import {Getter, State} from 'vuex-class';
    import {AsyncData} from '@/decorators/decorators';
    import {SecretType} from '@/models/SecretType';
    import SvgCross from '../components/atoms/SvgCross.vue';
    import ErrorDialog from '../components/organisms/dialogs/ErrorDialog.vue';

    @Component({
                   components: {
                       ErrorDialog,
                       SvgCross,
                       ActionButton,
                       RedirectDialog,
                       MasterPinDialog,
                       SetMasterPinDialog,
                       DialogTemplate,
                       WalletCard,
                   },
               })
    export default class CreateWalletView extends Vue {

        private get showSetupMasterPin(): boolean {
            return !this.isMasterPinInitiallyPresent && !this.isMasterPinEntered;
        }

        private get showEnterMasterPin(): boolean {
            return this.isMasterPinInitiallyPresent && !this.isMasterPinEntered;
        }

        private get showCreatingWallet(): boolean {
            return this.isMasterPinEntered && !this.isWalletPresent && !this.isWalletCreationFailed;
        }

        private get showWalletCreated(): boolean {
            return this.isMasterPinEntered && this.isWalletPresent;
        }

        private get showWalletCreationFailed(): boolean {
            return this.isMasterPinEntered && !this.isWalletPresent && this.isWalletCreationFailed;
        }

        // @State
        // private wallets!: Wallet[];
        @State
        public hasMasterPin!: boolean;
        @State
        public chain!: string;
        @Getter
        public secretType!: SecretType;
        @Getter
        public thirdPartyClientId!: string;

        private wallet!: Wallet;

        private isMasterPinInitiallyPresent = false;
        private isMasterPinEntered = false;
        private isWalletPresent = false;
        private isWalletCreationFailed = false;

        private timeleft = 5000;
        private redirectUri = '/';
        private interval!: any;

        // public created() {
        //     console.log(this.wallets);
        //     console.log(this.walletsForChainType);
        //     if (this.wallets && this.walletsForChainType > 0) {
        //         this.$router.replace({name: 'init', params: this.$route.params, query: this.$route.query});
        //     }
        // }

        public mounted(): void {
            this.redirectUri = (this.$route.query as any).redirectUri;
            this.isMasterPinInitiallyPresent = this.hasMasterPin;
        }

        // private get walletsForChainType() {
        //     return Utils.wallets.filterWalletsForChainType(this.wallets, this.chain);
        // }

        private async masterpinEntered(pincode: string) {
            if (pincode) {
                this.isMasterPinEntered = true;
                this.$store.dispatch('startLoading');
                this.createWallet(pincode)
                    .then((newWallet: Wallet) => {
                        this.wallet = newWallet;
                        this.isWalletPresent = !!(this.wallet);
                        this.$store.dispatch('stopLoading');
                        // this.interval = setInterval(() => {
                        //     this.timeleft = this.timeleft - 1000;
                        //     if (this.timeleft <= 0) {
                        //         clearInterval(this.interval);
                        //     }
                        // }, 1000);
                    })
                    .catch((reason: any) => {
                        this.$store.dispatch('stopLoading');
                        this.isWalletCreationFailed = true;
                    });
            }
        }

        private tryAgain() {
            this.isWalletCreationFailed = false;
            this.isMasterPinEntered = false;
        }

        private async createWallet(pincode: string): Promise<Wallet> {
            return this.$store.dispatch('createWallet', {secretType: this.secretType, masterPincode: pincode, clients: [this.thirdPartyClientId]});
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

</style>