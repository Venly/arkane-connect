<template>
    <form class="form">
        <div class="wallet-container">
            <template v-for="(wallet, index) in wallets">
                <div class="control control--checkbox" v-if="wallet" :key="index + 1">
                    <input type="checkbox"
                           class="control__checkbox control__checkbox--check control__checkbox--check--middle"
                           :tabindex="index + 1" :id="`wallet-${wallet.id}`" :checked="isChecked(wallet.id)"
                           @click="toggleWallet($event, wallet.id)"/>
                    <label class="control__label" :for="`wallet-${wallet.id}`">
                        <wallet-card :wallet="wallet"></wallet-card>
                    </label>
                </div>
            </template>
        </div>
        <action-button :tabindex="tindex" @click.prevent="linkWallets" :disabled="selectedWallets.length <= 0">
            Link Wallets
        </action-button>
    </form>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {Wallet, WalletType} from '@/models/Wallet';
    import {Validations} from '@/decorators/decorators';
    import {validationMixin} from 'vuelidate';
    import ActionButton from '@/components/atoms/ActionButton.vue';
    import WalletCard from '@/components/molecules/WalletCard.vue';

    @Component({
        components: {
            ActionButton,
            WalletCard,
        },
        mixins: [validationMixin],
    })
    export default class WalletNewForm extends Vue {
        @Prop()
        public wallets!: Wallet[];
        @Prop()
        public callback!: any;

        public selectedWallets: string[] = [];
        public tindex = this.wallets.length + 1;

        public isChecked(id: string): boolean {
            return this.selectedWallets.indexOf(id) > -1;
        }

        public toggleWallet($event: MouseEvent, id: string) {
            const i = this.selectedWallets.indexOf(id);
            if (i > -1) {
                delete this.selectedWallets[i];
            } else {
                this.selectedWallets.push(id);
            }
        }

        public linkWallets() {
            this.callback(this.wallets.filter((w: Wallet) => w && this.isChecked(`${w.id}`)));
        }
    }
</script>

<style lang="sass" scoped>
    @import ../../assets/sass/mixins-and-vars

    .box
        margin-top: rem(30px)

    .wallet-container
        background-color: $color-white-smoke
        max-height: rem(320px)
        overflow: auto
        padding: rem(16px)
        margin-bottom: rem(16px)
        border-top: 1px solid $color-border-grey
        border-bottom: 1px solid $color-border-grey

        .control__checkbox
            + label
                padding-right: 0
                width: 100%

    .actions
        text-align: right
</style>