<template>
  <div class="advanced">
    <h3>Transaction details</h3>

    <totals-box :amount-value="totalAmountInToken" :amount-currency="amountCurrencyLabel" :amount-decimals="{min: 2, max: 3}"
                :fee-value="maxEditedTransactionFee" :fee-currency="'VTHO'" :fee-decimals="{min: 2, max: 11}"></totals-box>

    <form class="form" @submit.prevent="doNothing">
      <div class="gas-coefficient control">
        <label for="gas-coefficient" class="control__label">Gas Price Coefficient</label>
        <input id="gas-coefficient" class="control__input" type="number" v-model="gasPriceCoef"/>
      </div>

      <div class="gas-limit control">
        <label for="gas-limit" class="control__label">Gas Limit</label>
        <input id="gas-limit" class="control__input" type="number" v-model="gasLimit"/>
      </div>

      <div class="data control" v-if="dataForSingleClauseTransaction && dataForSingleClauseTransaction !== ''">
        <label for="data" class="control__label">Data</label>
        <textarea id="data" class="control__input" readonly="readonly">{{dataForSingleClauseTransaction}}</textarea>
      </div>
    </form>
    <div class="buttons buttons--horizontal">
      <action-link :type="'muted'" @click="backClicked">&lt; Back</action-link>
      <button class="save-button btn" @click.prevent="saveClicked" @keyup.native.enter="saveClicked">Save</button>
    </div>
  </div>
</template>

<script lang='ts'>
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import FromTo from '../../molecules/FromTo.vue';
    import TotalsBox from '../../atoms/TotalsBox.vue';
    import Numpad from '../../molecules/Numpad.vue';
    import Utils from '../../../utils/Utils';
    import {State} from 'vuex-class';
    import {Wallet} from '../../../models/Wallet';
    import VueSlider from 'vue-slider-component';
    import ActionLink from '../../atoms/ActionLink.vue';
    import VechainTransactionData from '../../../api/vechain/VechainTransactionData';
    import TokenBalance from '../../../models/TokenBalance';

    @Component({
        components: {
            ActionLink,
            VueSlider,
            Numpad,
            TotalsBox,
            FromTo,
        },
    })
    export default class VechainTransactionAdvancedForm extends Vue {

        @Prop()
        public transactionData!: VechainTransactionData;
        @Prop()
        public hasTransactionData!: boolean;

        @Prop({required: false})
        public tokenBalance?: TokenBalance;

        public gasLimit: number = 0;
        public gasPriceCoef: number = 0;

        @State
        public transactionWallet?: Wallet;

        public mounted() {
            if (this.hasTransactionData) {
                this.initGas();
            }
        }

        public get amountCurrencyLabel() {
            return this.tokenBalance ? this.tokenBalance.symbol : 'VET';
        }

        public get toAddresses(): string[] {
            return this.transactionData ? (this.transactionData.clauses as any[]).map((clause) => clause.to) : [];
        }

        public get totalAmountInToken(): number {
            return this.transactionData
                ? Utils.rawValue().toTokenValue((this.transactionData.clauses as any[]).map((clause) => parseInt(clause.amount, 10))
                                                                                       .reduce(((amount1: number, amount2: number) => amount1 + amount2), 0))
                : 0;
        }

        private get maxEditedTransactionFee(): number {
            return this.gasLimit / 1000 * (1 + this.gasPriceCoef / 255);
        }

        public get dataForSingleClauseTransaction(): string {
            if (this.transactionData && this.transactionData.clauses && this.transactionData.clauses.length === 1) {
                return this.transactionData.clauses[0].data;
            }
            return '';
        }

        @Watch('hasTransactionData')
        public onTransactionDataReceivedCallback(oldValue: boolean, newValue: boolean) {
            if (newValue) {
                this.initGas();
            }
        }

        public backClicked() {
            this.$emit('back_clicked');
        }

        public saveClicked() {
            this.transactionData.gasPriceCoef = this.gasPriceCoef;
            this.transactionData.gas = this.gasLimit;
            this.$emit('saved');
        }


        public doNothing() {
            // Do nothing
        }

        private initGas() {
            this.gasLimit = this.transactionData.gas;
            this.gasPriceCoef = this.transactionData.gasPriceCoef;
        }
    }
</script>

<style lang='sass' scoped>
  @import ../../../assets/sass/mixins-and-vars

  .advanced
    width: 100%

  h3
    margin: 0 auto 30px auto
    font-size: rem(22px)
    line-height: normal

  .totals-box
    margin-top: rem(24px)

  .control
    margin-bottom: 0

  .gas-coefficient
    margin-top: rem(24px)

  /*.gas-limit*/
    /*margin-top: rem(25px)*/

  .data
    textarea
      height: rem(40px)
      font-size: rem(12px)
      line-height: rem(12px)

  .buttons
    margin: rem(30px 0)
    display: flex
    flex-wrap: nowrap
    justify-content: space-between
    align-items: center

    .btn
      width: 50%
      margin-bottom: 0

</style>
