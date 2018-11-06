<template>
  <div class="container">
    <div class="dialog-container">

      <enter-master-pin-modal :show="showEnterMasterPin" @done="masterpinEntered" @cancel="masterpinCancelClicked"></enter-master-pin-modal>

      <dialog-template v-if="showCreatingWallet" :title="'Creating wallet'">
        <p>A <strong>{{chainName}}</strong> wallet is being created...</p>
      </dialog-template>

      <redirect-dialog :title="'Congratulations!'" :icon="'success'" :redirectUri="redirectUri" :timeleft="timeleft" v-if="showWalletCreated">
        <p>A {{chainName}} wallet with the following address has been created and linked to your <strong>{{thirdPartyClientId}}</strong> account:</p>
        <p>
          <wallet-card :wallet="wallet" :showFunds="false"></wallet-card>
        </p>
        <div>
          <action-button @click="redirectBack">Continue to {{thirdPartyClientId}} ({{timeleft / 1000}})</action-button>
        </div>
      </redirect-dialog>

      <error-dialog v-if="showWalletCreationFailed" :title="creationFailedErrorMessage" :buttonText="'Try Again'" @button-clicked="tryAgain">
        <p>Something went wrong while trying to create your {{chainName}} wallet.</p>
        <p>Please try again. If the problem persists, contact support via <a href="mailto:support@arkane.network">support@arkane.network</a></p>
      </error-dialog>
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import WalletCard from '@/components/molecules/WalletCard.vue';
    import EnterMasterPinModal from '@/components/organisms/modals/EnterMasterPinModal.vue';
    import RedirectDialog from '@/components/organisms/dialogs/RedirectDialog.vue';
    import DialogTemplate from '@/components/molecules/DialogTemplate.vue';
    import ActionButton from '@/components/atoms/ActionButton.vue';
    import SvgCross from '@/components/atoms/SvgCross.vue';
    import ErrorDialog from '@/components/organisms/dialogs/ErrorDialog.vue';
    import {Wallet} from '../models/Wallet';
    import {Getter, State} from 'vuex-class';
    import {Chain} from '../models/Chain';

    @Component({
        components: {
            EnterMasterPinModal,
            ErrorDialog,
            SvgCross,
            ActionButton,
            RedirectDialog,
            DialogTemplate,
            WalletCard,
        },
    })
    export default class CreateWalletView extends Vue {

        private get showEnterMasterPin(): boolean {
            return !this.isMasterPinEntered;
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

        public get chainName(): string {
            return this.chain.name;
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
        private isWalletCreationFailed = false;
        private timeleft = 5000;

        private redirectUri = '/';
        private interval!: any;

        private creationFailedErrorMessage = 'Something went wrong';

        public created(): void {
            this.redirectUri = (this.$route.query as any).redirectUri;
            if (this.enteredPincode !== '') {
                this.isMasterPinEntered = true;
                this.masterpinEntered(this.enteredPincode);
            }
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
                        if (reason && reason.data && reason.data.errors && reason.data.errors.length > 0) {
                            this.creationFailedErrorMessage = reason.data.errors[0].message;
                        }

                        this.$store.dispatch('stopLoading');
                        this.isWalletCreationFailed = true;
                    });
            }
        }

        private masterpinCancelClicked() {
            this.$emit('cancelClicked');
        }

        private tryAgain() {
            this.isWalletCreationFailed = false;
            this.isMasterPinEntered = false;
        }

        private async createWallet(pincode: string): Promise<Wallet> {
            return this.$store.dispatch('createWallet', {secretType: this.chain.secretType, pincode, clients: [this.thirdPartyClientId]});
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