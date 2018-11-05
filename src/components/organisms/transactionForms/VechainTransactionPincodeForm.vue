<template>
  <div class="vet-tx-pincode-form">
    <h3>Enter your pincode to {{action}} this transaction</h3>

    <from-to :from="transactionWallet" :toAddresses="toAddresses" :max-lines="3"></from-to>

    <totals-box :amount-value="totalAmountInToken" :amount-currency="amountCurrencyLabel" :amount-decimals="{min: 2, max: 3}"
                :fee-value="maxTransactionFee()" :fee-currency="'VTHO'" :fee-decimals="{min: 2, max: 9}"
                :show-advanced-icon="true" @advanced_clicked="advancedClicked"></totals-box>

    <numpad :params="transactionData" :disabled="disabled" @pincode_entered="pincodeEntered" :action="action"></numpad>
  </div>
</template>

<script lang='ts'>

    import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
    import FromTo from '../../molecules/FromTo.vue';
    import TotalsBox from '../../atoms/TotalsBox.vue';
    import Numpad from '../../molecules/Numpad.vue';
    import Utils from '../../../utils/Utils';
    import {State} from 'vuex-class';
    import {Wallet} from '../../../models/Wallet';
    import VechainTransactionData from '../../../api/vechain/VechainTransactionData';
    import TokenBalance from '../../../models/TokenBalance';

    @Component({
        components: {
            Numpad,
            TotalsBox,
            FromTo,
        },
    })
    export default class VechainTransactionPincodeForm extends Vue {

        @Prop()
        public transactionData!: VechainTransactionData;

        @Prop({required: false})
        public tokenBalance?: TokenBalance;

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

        public get toAddresses(): string[] {
            return this.transactionData ? (this.transactionData.clauses as any[]).map((clause) => clause.to) : [];
        }

        public get amountCurrencyLabel() {
            return this.tokenBalance ? this.tokenBalance.symbol : 'VET';
        }

        public get totalAmountInToken(): number {
            return this.transactionData
                ? Utils.rawValue().toTokenValue((this.transactionData.clauses as any[]).map((clause) => parseInt(clause.amount, 10))
                                                                                       .reduce(((amount1: number, amount2: number) => amount1 + amount2), 0))
                : 0;
        }

        private maxTransactionFee(): number {
            // Base Thor rate and tx fee
            //
            // "VeChainThor blockchain transaction consumes gas, gas is converted into VTHO based on gasPrice and account VTHO is deducted to calculate the transaction fee. The
            // calculation equation is: VTHO = (1 + gasPriceCoef/255) * baseGasPrice
            // Current mainnet set baseGasPrice to be: 1 VTHO = 1000gas (always subject to the actual network parameter). The VET transfer fee is 21000gas. If gasPriceCoef = 0,
            // the used VTHO = (1 + 0/255) * 21000/1000 = 21 VTHO
            // The priority of a transaction in transaction pool can be raised by adjusting gasPriceCoef. For example, if gasPriceCoef =128, used VTHO = (1 + 128/255) * 21000/1000
            // = 31.5 VTHO"
            return this.transactionData.gas / 1000 * (1 + this.transactionData.gasPriceCoef / 255);
        }
    }

</script>

<style lang='sass' scoped>
  @import ../../../assets/sass/mixins-and-vars

  .vet-tx-pincode-form
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