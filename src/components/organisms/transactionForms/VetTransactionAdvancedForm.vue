<template>
  <div class="advanced">
    <h3>Transaction details</h3>

    <from-to :from="fromAddress" :toAddresses="toAddresses" :max-lines="3"></from-to>

    <totals-box :amount-value="totalAmountInVet" :amount-currency="'VET'" :amount-decimals="{min: 2, max: 3}"
                :fee-value="maxEditedTransactionFee" :fee-currency="'VTHO'" :fee-decimals="{min: 2, max: 11}"></totals-box>

    <form class="form" @submit.prevent="doNothing">
      <div class="gas-coefficient control">
        <label for="gas-coefficient" class="control__label">Gas coefficient</label>
        <input id="gas-coefficient" class="control__input" type="number" v-model="gasPriceCoef"/>
      </div>

      <div class="gas-limit control">
        <label for="gas-limit" class="control__label">Gas limit</label>
        <input id="gas-limit" class="control__input" type="number" v-model="gasLimit"/>
      </div>

      <div class="data control">
        <label for="data" class="control__label">Data</label>
        <textarea id="data" class="control__input" v-model="transactionData.data" readonly="readonly"></textarea>
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
    import VechainTransactionData from '../../../api/VechainTransactionData';

    @Component({
        components: {
            ActionLink,
            VueSlider,
            Numpad,
            TotalsBox,
            FromTo,
        },
    })
    export default class VetTransactionAdvancedForm extends Vue {

        @Prop()
        public transactionData!: VechainTransactionData;
        @Prop()
        public hasTransactionData!: boolean;

        public gasLimit: number = 0;
        public gasPriceCoef: number = 0;

        @State
        public transactionWallet?: Wallet;

        public mounted() {
            if (this.hasTransactionData) {
                this.initGas();
            }
        }

        public get fromAddress(): string {
            return !(!this.transactionWallet) ? this.transactionWallet.address : '0x0000000000000000000000000000000000000000';
        }

        public get toAddresses(): string[] {
            return this.transactionData ? (this.transactionData.clauses as any[]).map((clause) => clause.to) : [];
        }

        public get totalAmountInVet(): number {
            return this.transactionData
                ? Utils.rawValue().toTokenValue((this.transactionData.clauses as any[]).map((clause) => parseInt(clause.amount, 10))
                                                                                       .reduce(((amount1: number, amount2: number) => amount1 + amount2), 0))
                : 0;
        }

        private get maxEditedTransactionFee(): number {
            return this.gasLimit / 1000 * (1 + this.gasPriceCoef / 255);
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
            this.transactionData.gasPriceCoef = this.gasPriceCoef.toString();
            this.transactionData.gas = this.gasLimit;
            this.$emit('saved');
        }


        public doNothing() {
            // Do nothing
        }

        private initGas() {
            this.gasLimit = this.transactionData.gas;
            this.gasPriceCoef = parseInt(this.transactionData.gasPriceCoef, 10);
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
    margin-top: rem(75px)

  /*.gas-limit*/
    /*margin-top: rem(25px)*/

  .data
    textarea
      height: rem(215px)

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
