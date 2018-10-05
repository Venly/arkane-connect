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
        <p>A <strong>{{chain}}</strong> wallet with the following address has been created:</p>
        <p>
          <wallet-card :wallet="wallet" :showFunds="false"></wallet-card>
        </p>
        <p>
          <action-button @click="redirectBack">Continue to ThorBlock ({{timeleft / 1000}})</action-button>
        </p>
      </redirect-dialog>

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
    export default class CreateWalletView extends Vue {

        private get showSetupMasterPin(): boolean {
            return !this.isMasterPinInitiallyPresent && !this.isMasterPinEntered;
        }

        private get showEnterMasterPin(): boolean {
            return this.isMasterPinInitiallyPresent && !this.isMasterPinEntered;
        }

        private get showCreatingWallet(): boolean {
            return this.isMasterPinEntered && !this.isWalletPresent;
        }

        private get showWalletCreated(): boolean {
            return this.isMasterPinEntered && this.isWalletPresent;
        }

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

        private timeleft = 5000;
        private redirectUri = '/';
        private interval!: any;

        public mounted(): void {
            this.redirectUri = (this.$route.query as any).redirectUri;
            this.isMasterPinInitiallyPresent = this.hasMasterPin;
        }

        private async masterpinEntered(pincode: string) {
            if (pincode) {
                this.isMasterPinEntered = true;
                this.$store.dispatch('startLoading');
                this.createWallet(pincode)
                    .then((newWallet: Wallet) => {
                        this.wallet = newWallet;
                        this.isWalletPresent = !!(this.wallet);
                        this.$store.dispatch('stopLoading');
                        this.interval = setInterval(() => {
                            this.timeleft = this.timeleft - 1000;
                            if (this.timeleft <= 0) {
                                clearInterval(this.interval);
                            }
                        }, 1000);
                    })
                    .catch((reason: any) => {
                        // TODO Error page
                    });
            }
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
  .container
    min-height: 100vh

    .dialog-container
      display: flex
      height: 100%
      justify-content: center
      align-items: center
</style>