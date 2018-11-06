<template>
  <div class="container">
    <div class="dialog-container">
      <import-wallet-dialog v-if="showImportWallet" :thirdPartyClientId="thirdPartyClientId"
                            @importPrivateKeyClicked="importPrivateKey" @importKeystoreClicked="importKeystore" @backClicked="backToManagement">
      </import-wallet-dialog>

      <enter-master-pin-modal :show="showEnterMasterPin" @done="masterpinEntered" @cancel="backToImport"></enter-master-pin-modal>

      <dialog-template v-if="showImportingWallet" :title="'Importing wallet'">
        <p>Your <strong>{{chainName}}</strong> wallet is being imported...</p>
      </dialog-template>

      <redirect-dialog :title="'Congratulations!'" :icon="'success'" :redirectUri="redirectUri" :timeleft="timeleft" v-if="showWalletImported">
        <p>Your {{chainName}} wallet with the following address has been imported and linked to your <strong>{{thirdPartyClientId}}</strong> account:</p>
        <p>
          <wallet-card :wallet="wallet" :showFunds="false"></wallet-card>
        </p>
        <div>
          <action-button @click="redirectBack">Continue to {{thirdPartyClientId}} ({{timeleft / 1000}})</action-button>
        </div>
      </redirect-dialog>

      <error-dialog v-if="showWalletImportFailed" :title="'Something went wrong'" :buttonText="'Try Again'" @button-clicked="tryAgain">
        <p>Something went wrong while trying to import your {{chainName}} wallet.</p>
        <p>Please try again. If the problem persists, contact support via <a href="mailto:support@arkane.network">support@arkane.network</a></p>
      </error-dialog>
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
    import WalletCard from '@/components/molecules/WalletCard.vue';
    import RedirectDialog from '@/components/organisms/dialogs/RedirectDialog.vue';
    import DialogTemplate from '@/components/molecules/DialogTemplate.vue';
    import ActionButton from '@/components/atoms/ActionButton.vue';
    import {Wallet} from '../models/Wallet';
    import {Getter, State} from 'vuex-class';
    import SvgCross from '../components/atoms/SvgCross.vue';
    import ErrorDialog from '../components/organisms/dialogs/ErrorDialog.vue';
    import ImportWalletDialog from '@/components/organisms/dialogs/ImportWalletDialog.vue';
    import EnterMasterPinModal from '@/components/organisms/modals/EnterMasterPinModal.vue';
    import {Chain} from '../models/Chain';
    import Api from '../api';

    @Component({
        components: {
            EnterMasterPinModal,
            ImportWalletDialog,
            ErrorDialog,
            SvgCross,
            ActionButton,
            RedirectDialog,
            DialogTemplate,
            WalletCard,
        },
    })
    export default class ImportWalletView extends Vue {

        public get chainName(): string {
            return this.chain.name;
        }

        private get showImportWallet(): boolean {
            return (this.privateKeyIsEmpty && this.keystoreIsEmpty) || this.showEnterMasterPin;
        }

        private get showEnterMasterPin(): boolean {
            return !(this.privateKeyIsEmpty && this.keystoreIsEmpty) && !this.isMasterPinEntered;
        }

        private get showImportingWallet(): boolean {
            return !(this.privateKeyIsEmpty && this.keystoreIsEmpty) && this.isMasterPinEntered && !this.isWalletPresent && !this.isWalletImportFailed;
        }

        private get showWalletImported(): boolean {
            return !(this.privateKeyIsEmpty && this.keystoreIsEmpty) && this.isMasterPinEntered && this.isWalletPresent;
        }

        private get showWalletImportFailed(): boolean {
            return !(this.privateKeyIsEmpty && this.keystoreIsEmpty) && this.isMasterPinEntered && !this.isWalletPresent && this.isWalletImportFailed;
        }

        private get privateKeyIsEmpty() {
            return this.privateKey === '';
        }

        private get keystoreIsEmpty() {
            return this.keystore === '' && this.keystorePassword === '';
        }

        @State
        public hasMasterPin!: boolean;
        @State
        public chain!: Chain;

        @Getter
        public thirdPartyClientId!: string;

        @Prop({required: false, default: ''})
        private enteredPincode!: string;

        private wallet!: Wallet;

        private isMasterPinEntered = false;
        private isWalletPresent = false;
        private isWalletImportFailed = false;

        private timeleft = 5000;
        private redirectUri = '/';
        private interval!: any;

        private privateKey: string = '';
        private keystore: string = '';
        private keystorePassword: string = '';


        public created(): void {
            this.redirectUri = (this.$route.query as any).redirectUri;
            if (this.enteredPincode !== '') {
                this.isMasterPinEntered = true;
            }
        }

        private importPrivateKey(privateKey: string): void {
            this.privateKey = privateKey;
            if (this.isMasterPinEntered) {
                this.masterpinEntered(this.enteredPincode);
            }
        }

        private importKeystore(keystore: string, keystorePassword: string) {
            this.keystore = keystore;
            this.keystorePassword = keystorePassword;
            if (this.isMasterPinEntered) {
                this.masterpinEntered(this.enteredPincode);
            }
        }

        private async masterpinEntered(pincode: string) {
            if (pincode) {
                this.isMasterPinEntered = true;
                this.$store.dispatch('startLoading');
                this.importWallet(pincode)
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
                        this.$store.dispatch('stopLoading');
                        this.isWalletImportFailed = true;
                    });
            }
        }

        private async importWallet(pincode: string): Promise<Wallet> {
            if (!this.privateKeyIsEmpty) {
                const wallet = await this.$store
                                         .dispatch(
                                             'importPrivateKey',
                                             {importWalletType: this.chain.importWalletType, pincode, privateKey: this.privateKey},
                                         );
                await Api.linkWallet({client: this.thirdPartyClientId, walletIds: [wallet.id]});
                return wallet;
            } else if (!this.keystoreIsEmpty) {
                const wallet = await this.$store
                                         .dispatch(
                                             'importKeystore',
                                             {importWalletType: this.chain.importWalletType, pincode, keystore: this.keystore, password: this.keystorePassword},
                                         );
                await Api.linkWallet({client: this.thirdPartyClientId, walletIds: [wallet.id]});
                return wallet;
            }
            return new Promise<Wallet>((resolve, reject) => {
                reject();
            });
        }

        @Emit('backClicked')
        private backToManagement() {
            // Intentionally left blank
        }

        private backToImport() {
            this.privateKey = '';
            this.keystore = '';
            this.keystorePassword = '';
        }

        private tryAgain() {
            this.privateKey = '';
            this.keystore = '';
            this.keystorePassword = '';
            this.isWalletImportFailed = false;
            this.isMasterPinEntered = false;
        }

        private redirectBack() {
            window.location.href = this.redirectUri;
        }
    }
</script>

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