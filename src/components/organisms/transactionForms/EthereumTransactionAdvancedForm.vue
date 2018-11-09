<template>
  <div class="advanced">
    <h3>Transaction details</h3>

    <totals-box :amount-value="amountInEther" :amount-currency="amountCurrencyLabel" :amount-decimals="{min: 2, max: 3}"
                :fee-value="maxEditedTransactionFee" :fee-currency="'ETH'" :fee-decimals="{min: 2, max: 6}"></totals-box>

    <div class="speed-slider-box">
      <vue-slider ref="speedSlider" class="speed-slider"
                  v-model="gasPrice"
                  :data="gasOptions"
                  :piecewise="speedSelectorOptions.piecewise"
                  :dotSize="speedSelectorOptions.dotSize"
                  :formatter="speedSelectorOptions.formatter"
                  :bgStyle="speedSelectorOptions.bgStyle"
                  :processStyle="speedSelectorOptions.processStyle"
                  :tooltipStyle="speedSelectorOptions.tooltipStyle"
                  :piecewiseStyle="speedSelectorOptions.piecewiseStyle"
                  :piecewiseActiveStyle="speedSelectorOptions.piecewiseActiveStyle"
                  :lazy="speedSelectorOptions.lazy">
      </vue-slider>
      <div class="speed-slider-box--labels">
        <div>slow</div>
        <div>fast</div>
      </div>
    </div>
    <form class="form" @submit.prevent="doNothing">
      <div class="gas-limit control">
        <label for="gas-limit" class="control__label">Gas limit</label>
        <input id="gas-limit" class="control__input" type="number" v-model="gasLimit"/>
      </div>

      <div class="data control">
        <label for="data" class="control__label">Data</label>
        <textarea id="data" class="control__input" v-model="transactionRequest.data"></textarea>
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
import EthereumTransactionRequest from '../../../api/model/ethereum/EthereumTransactionRequest';
import Utils from '../../../utils/Utils';
import {State} from 'vuex-class';
import {Wallet} from '../../../models/Wallet';
import VueSlider from 'vue-slider-component';
import ActionLink from '../../atoms/ActionLink.vue';
import EthereumTransactionPreparationDto from '../../../models/transaction/preparation/ethereum/EthereumTransactionPreparationDto';
import GasPriceDto from '../../../models/transaction/preparation/ethereum/GasPriceDto';
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
export default class EthereumTransactionAdvancedForm extends Vue {

    @Prop()
    public transactionRequest!: EthereumTransactionRequest;
    @Prop()
    public hasTransactionRequest!: boolean;
    @Prop({required: false})
    public tokenBalance?: TokenBalance;
    @Prop()
    public transactionPreparation!: EthereumTransactionPreparationDto;

    public gasLimit: number = 0;
    public gasPrice: number = 0;

    @State
    public transactionWallet?: Wallet;

    public speedSelectorOptions: any = {
        piecewise: true,
        dotSize: 16,
        formatter: ((value: number) => `${Utils.formatNumber(value, 0, 3)} GWEI`),
        bgStyle: {
            backgroundColor: '#9b9b9b',
        },
        processStyle: {
            backgroundColor: '#278dae',
        },
        tooltipStyle: {
            backgroundColor: '#278dae',
            borderColor: '#278dae',
        },
        piecewiseStyle: {
            backgroundColor: '#9b9b9b',
            visibility: 'visible',
            width: '12px',
            height: '12px',
        },
        piecewiseActiveStyle: {
            backgroundColor: '#278dae',
        },
        lazy: true,
    };

    public mounted() {
        if (this.hasTransactionRequest) {
            this.initGas();
        }
    }

    public get amountCurrencyLabel() {
        return this.tokenBalance ? this.tokenBalance.symbol : 'ETH';
    }

    public get fromAddress(): string {
        return this.transactionWallet ? this.transactionWallet.address : '0x0000000000000000000000000000000000000000';
    }

    public get amountInEther(): number {
        return Utils.rawValue().toTokenValue(this.transactionRequest.value, this.tokenBalance ? this.tokenBalance.decimals : 18);
    }

    public get maxEditedTransactionFee(): number {
        return ((this.gasLimit * this.gasPrice) / Math.pow(10, 9));
    }

    public get gasOptions(): number[] {
        if (this.transactionPreparation) {
            const options: number[] = (this.transactionPreparation as EthereumTransactionPreparationDto).gasPrices
                                                                                                        .map((gasPrice: GasPriceDto) => {
                                                                                                     return Utils.rawValue().toGwei(gasPrice.gasPrice);
                                                                                                 });

            const originalValue: number = this.gasPriceInGWei();
            if (options.findIndex((value: number) => value === originalValue) < 0) {
                options.push(originalValue);
            }
            return options.sort((a, b) => a - b);
        }
        return [];
    }

    public gasPriceInGWei(): number {
        return Utils.rawValue().toGwei(Utils.zeroIfUndefined(this.transactionRequest && this.transactionRequest.gasPrice));
    }

    @Watch('hasTransactionRequest')
    public onTransactionRequestReceivedCallback(oldValue: boolean, newValue: boolean) {
        if (newValue) {
            this.initGas();
        }
    }

    public backClicked() {
        this.$emit('back_clicked');
    }

    public saveClicked() {
        this.transactionRequest.gasPrice = Utils.gwei().toRawValue(this.gasPrice);
        this.transactionRequest.gas = this.gasLimit;
        this.$emit('saved');
    }

    public afterEnter() {
        (this.$refs.speedSlider as any).refresh();
    }

    public doNothing() {
        // Do nothing
    }

    private initGas() {
        this.gasLimit = Utils.zeroIfUndefined(this.transactionRequest && this.transactionRequest.gas);
        this.gasPrice = this.gasPriceInGWei();
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

  .speed-slider-box
    margin-top: rem(50px)

    &--labels
      display: flex
      justify-content: space-between
      font-size: $font-size-small
      color: $color-warm-grey

  .control
    margin-bottom: 0

  .gas-limit
    margin-top: rem(25px)

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