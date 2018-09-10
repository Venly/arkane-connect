<template>
  <div class="container">
    <div class="dialog-container">
      <transition name="slide-left">
        <set-master-pin-dialog @done="masterpinEntered" v-if="showSetupMasterPin"></set-master-pin-dialog>
      </transition>
      <transition name="slide-left">
        <master-pin-dialog :title="'Create a wallet'" @done="masterpinEntered" v-if="showEnterMasterPin">
          <p>Please confirm by providing your Master Pin Code.</p>
        </master-pin-dialog>
      </transition>
      <transition name="slide-left">
        <dialog-template v-if="showCreatingWallet" :title="'Creating wallet'">
          <p>A <strong>{{chain}}</strong> wallet is being created...</p>
        </dialog-template>
      </transition>
      <transition name="slide-left">
        <redirect-dialog :title="'Congratulations!'" :icon="'success'" :redirectUri="redirectUri" :timeleft="timeleft" v-if="showWalletCreated">
          <p>A <strong>{{chain}}</strong> wallet with the following address has been created:</p>
          <p><wallet-card :wallet="wallet" :showFunds="false"></wallet-card></p>
          <p><action-button @click="redirectBack">Continue to ThorBlock ({{timeleft / 1000}})</action-button></p>
        </redirect-dialog>
      </transition>
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
import {Wallet} from '@/models/Wallet';
import {Getter, State} from 'vuex-class';
import {AsyncData} from '@/decorators/decorators';
import {Store} from 'vuex';
import {Route} from 'vue-router';
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
export default class InitView extends Vue {

    private get showSetupMasterPin(): boolean {
        return !this.isMasterPinInitiallyPresent  && !this.isMasterPinEntered;
    }

    private get showEnterMasterPin(): boolean {
        return this.isMasterPinInitiallyPresent  && !this.isMasterPinEntered;
    }

    private get showCreatingWallet(): boolean {
        return this.hasMasterPin && this.isMasterPinEntered && !this.isWalletPresent;
    }

    private get showWalletCreated(): boolean {
        return this.hasMasterPin && this.isMasterPinEntered && this.isWalletPresent;
    }
    @State
    public hasMasterPin!: boolean;
    @State
    public userId!: string;
    @State
    public wallets!: Wallet[];
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
        if (this.hasMasterPin
            && this.secretType
            && this.wallets
            && this.wallets.length > 0
            && this.wallets.filter((wallet) => this.secretType === wallet.secretType).length > 0) {
            this.isWalletPresent = true;
            this.redirectBack();
        }
    }

    @AsyncData
    public async asyncData(store: Store<any>, to: Route): Promise<any> {
        await store.dispatch('getUserData');
        return store.dispatch('getUserWallets');
    }

    private async masterpinEntered(pincode: string) {
        if (pincode) {
            this.isMasterPinEntered = true;
            this.$store.dispatch('startLoading');
            this.wallet = await this.createWallet(pincode);
            this.isWalletPresent = !!(this.wallet);
            this.$store.dispatch('stopLoading');
            this.interval = setInterval(() => {
                this.timeleft = this.timeleft - 1000;
                if (this.timeleft <= 0) {
                    clearInterval(this.interval);
                }
            }, 1000);
        }
    }

    private async createWallet(pincode: string): Promise<Wallet> {
        this.isWalletPresent = !!(this.wallet);
        this.wallet = await this.$store.dispatch('createWallet', {secretType: this.secretType, masterPincode: pincode, clients: [this.thirdPartyClientId]});
        return this.wallet;
    }

    private redirectBack() {
        window.location.href = this.redirectUri;
    }
}
</script>

<style lang="sass">
  @import ../assets/sass/mixins-and-vars

  body
    background-color: $color-white

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