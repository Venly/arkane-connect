<template>
  <div class="container">
      <transition name="slide-left">
        <master-pin-dialog @done="updatePincode" v-if="!ready"></master-pin-dialog>
      </transition>
      <transition name="slide-left">
        <redirect-dialog :title="'Congratulations!'" :icon="'success'" :redirectUri="redirectUri" :timeleft="timeleft" v-if="ready">
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

    @Component({
        components: {
            RedirectDialog,
            MasterPinDialog,
            WalletCard,
        },
    })
    export default class MasterPinView extends Vue {
        public chain!: string;
        public project!: string;
        public ready = false;

        // todo: create a real wallet on initial set wallet
        public wallet: Wallet = Object.assign(new Wallet(), { alias: 'Fake wallet', address: '0x0' });

        private timeleft = 3000;
        private redirectUri = '/';
        private interval!: any;


        public created(): void {
            const params: any = this.$route.params;
            this.chain = params.chain;
            this.project = params.project || 'Arkane';
            const redirect = this.$route.query ? (this.$route.query as any).redirect : null;
            this.redirectUri = decodeURIComponent(redirect || '/');
        }

        public updatePincode(pincode: string) {
            if (pincode) {
                this.ready = true;
                this.interval = setInterval(() => {
                    this.timeleft = this.timeleft - 1000;
                    if (this.timeleft <= 0) {
                        clearInterval(this.interval);
                    }
                }, 1000);
            }
        }
    }
</script>