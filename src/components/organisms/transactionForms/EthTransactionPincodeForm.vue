<template>
  <div class="eth-tx-pincode-form">
    <h3>Enter your pincode to {{action}} this transaction</h3>

    <from-to :from="transactionWallet" :to="transactionData.to"></from-to>

    <totals-box :amount-value="amountInEther" :amount-currency="'ETH'" :amount-decimals="{min: 2, max: 3}"
                :fee-value="maxTransactionFee()" :fee-currency="'GWEI'" :fee-decimals="{min: 2, max: 6}"
                :show-advanced-icon="true" @advanced_clicked="advancedClicked"></totals-box>

    <numpad :params="transactionData" :disabled="disabled" @pincode_entered="pincodeEntered" :action="action"></numpad>
  </div>
</template>

<script lang='ts'>

    import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
    import FromTo from '../../molecules/FromTo.vue';
    import TotalsBox from '../../atoms/TotalsBox.vue';
    import Numpad from '../../molecules/Numpad.vue';
    import EthereumTransactionData from '../../../api/EthereumTransactionData';
    import Utils from '../../../utils/Utils';
    import {State} from 'vuex-class';
    import {Wallet} from '../../../models/Wallet';

    @Component({
        components: {
            Numpad,
            TotalsBox,
            FromTo,
        },
    })
    export default class EthTransactionPincodeForm extends Vue {

        @Prop()
        public transactionData!: EthereumTransactionData;

        @Prop()
        public action!: 'sign' | 'execute';

        @Prop({required: false, default: false})
        public disabled!: boolean;

        @State
        public transactionWallet?: Wallet;

        @Emit('advanced_clicked')
        public advancedClicked() {
            // @Emit will handle this
        }

        @Emit('pincode_entered')
        public pincodeEntered(pincode: string) {
            // @Emit will handle this
        }

        public get fromAddress(): string {
            return this.transactionWallet ? this.transactionWallet.address : '0x0000000000000000000000000000000000000000';
        }

        public get amountInEther(): number {
            return Utils.rawValue().toTokenValue(this.transactionData.value);
        }

        private maxTransactionFee(): number {
            return (this.transactionData.gas * this.gasPriceInGWei());
        }

        private gasPriceInGWei(): number {
            return Utils.rawValue().toGwei(this.transactionData.gasPrice);
        }
    }

</script>

<style lang='sass' scoped>
  @import ../../../assets/sass/mixins-and-vars

  .eth-tx-pincode-form
    width: 100%

  h3
    margin: 0 auto 30px auto
    font-size: rem(22px)
    line-height: normal

  .totals-box
    margin-top: rem(24px)

  .numpad
    margin-top: rem(12px)

</style>