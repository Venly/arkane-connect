<template>
    <dialog-template :title="'Access to your wallets'" v-if="wallets.length > 0">
        <p class="description no-margin-bottom">Select the wallets that application <b>{{thirdPartyClientId}}</b> is allowed to access:</p>
        <form class="form">
            <div class="wallets">
                <div class="wallet-control" v-for="wallet in wallets">
                    <div class="control control--checkbox">
                        <input :ref="`wallet-${wallet.id}`" :id="`wallet-${wallet.id}`" :value="wallet" v-model="selectedWallets"
                               class="control__checkbox control__checkbox--check wallet-select" type="checkbox"/>
                        <label class="control__label" :for="`wallet-${wallet.id}`"></label>
                    </div>
                    <wallet-card :wallet="wallet" :showFunds="false" @click="walletSelected(wallet)"></wallet-card>
                </div>
            </div>
        </form>
        <action-button class="link-button"
                       :type="'brand-light'"
                       @click="linkWallets"
                       :disabled="selectedWallets.length <= 0"
                       :title="selectedWallets.length <= 0 ? 'At least one wallet needs to be selected' : ''">Link Wallets
        </action-button>
        <div class="separator">
            <div class="separator__label">or</div>
        </div>
        <action-button @click="createWallet">Create a New Wallet</action-button>
    </dialog-template>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import WalletCard from '@/components/molecules/WalletCard.vue';
    import MasterPinDialog from '@/components/organisms/dialogs/MasterPinDialog.vue';
    import SetMasterPinDialog from '@/components/organisms/dialogs/SetMasterPinDialog.vue';
    import RedirectDialog from '@/components/organisms/dialogs/RedirectDialog.vue';
    import DialogTemplate from '@/components/molecules/DialogTemplate.vue';
    import ActionButton from '@/components/atoms/ActionButton.vue';
    import {Wallet} from '../../../models/Wallet';
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
    export default class LinkWalletsDialog extends Vue {
        @Prop()
        private wallets!: Wallet[];
        @Prop()
        private chain!: string;
        @Prop()
        private thirdPartyClientId!: string;

        private selectedWallets: Wallet[] = [];

        private walletSelected(selectedWallet: Wallet) {
            if (this.selectedWallets.indexOf(selectedWallet) > -1) {
                this.selectedWallets = this.selectedWallets.filter((wallet: Wallet) => wallet.id !== selectedWallet.id);
            } else {
                this.selectedWallets.push(selectedWallet);
            }
        }

        private linkWallets() {
            this.$emit('linkWalletsClicked', {wallets: this.selectedWallets});
        }

        private createWallet() {
            this.$emit('createWalletClicked');
        }
    }
</script>
<style lang="sass" scoped>
    @import "../../../assets/sass/mixins-and-vars"

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

</style>