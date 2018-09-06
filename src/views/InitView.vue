<template>
  <div class="container">
    <transition name="slide-left">
      <master-pin-dialog @done="updatePincode" v-if="!ready"></master-pin-dialog>
    </transition>
    <transition name="slide-left">
      <redirect-dialog :title="'Congratulations!'" :icon="'success'" :redirectUri="redirectUri"
                       :timeleft="timeleft" v-if="ready">
        <p>A <strong>{{chain}}</strong> wallet with the following address has been created:</p>
        <wallet-card :wallet="wallet" :showFunds="false"></wallet-card>
      </redirect-dialog>
    </transition>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import WalletCard from '@/components/molecules/WalletCard.vue';
    import MasterPinDialog from '@/components/organisms/dialogs/MasterPinDialog.vue';
    import RedirectDialog from '@/components/organisms/dialogs/RedirectDialog.vue';
    import {Wallet} from '@/models/Wallet';
    import {Getter, State} from 'vuex-class';
    import {AsyncData} from '@/decorators/decorators';
    import {Store} from 'vuex';
    import {Route} from 'vue-router';
    import {SecretType} from '@/models/SecretType';

    @Component({
        components: {
            RedirectDialog,
            MasterPinDialog,
            WalletCard,
        },
    })
    export default class InitView extends Vue {
        @State
        public hasMasterPin!: boolean;
        @State
        public userId!: string;
        @Getter
        public secretType!: SecretType;

        public project!: string;
        public ready = false;

        public wallet!: Wallet;

        private timeleft = 3000;
        private redirectUri = '/';
        private interval!: any;

        public mounted(): void {
            this.redirectUri = (this.$route.query as any).redirectUri;
        }

        public async updatePincode(pincode: string) {
            if (pincode) {
                try {
                    this.wallet = await this.createWallet(pincode).catch();
                    this.ready = true;
                    this.interval = setInterval(() => {
                        this.timeleft = this.timeleft - 1000;
                        if (this.timeleft <= 0) {
                            clearInterval(this.interval);
                        }
                    }, 1000);
                } catch (e) {
                    //
                }
            }
        }

        public createWallet(pincode: string) {
            return this.$store.dispatch('createWallet', {secretType: this.secretType, masterPincode: pincode});
        }

        @AsyncData
        public async asyncData(store: Store<any>, to: Route): Promise<any> {
            return store.dispatch('getUserData');
        }
    }
</script>