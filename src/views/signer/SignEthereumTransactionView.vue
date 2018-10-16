<template>
  <div class="signer">
    <div class="logo-wrapper">
      <img class="logo" alt="Arkane Logo" src="../../assets/logo-arkane-animated.svg"/>
    </div>
    <div v-if="isInitialised" class="content">


      <transition name="slide-left">
        <div v-if="!showAdvanced">
          <h3>Enter your pincode to sign this transaction</h3>

          <from-to :from="fromAddress" :to="transactionData.to"></from-to>

          <totals-box :amount-value="amountInEther" :amount-currency="'ETH'" :amount-decimals="{min: 2, max: 3}"
                      :fee-value="maxTransactionFee()" :fee-currency="'GWEI'" :fee-decimals="{min: 2, max: 6}"
                      :show-advanced-icon="true" @advanced-clicked="showAdvanced = true"></totals-box>

          <numpad :params="transactionData" :disabled="hasBlockingError" @pincode_entered="pinEntered"></numpad>
        </div>
      </transition>


      <transition name="slide-right" @after-enter="afterAdvancedEnter">
        <div v-if="showAdvanced" class="advanced">
          <h3>Transaction details</h3>

          <from-to :from="transactionWallet.address" :to="transactionData.to"></from-to>

          <totals-box :amount-value="amountInEther" :amount-currency="'ETH'" :amount-decimals="{min: 2, max: 3}"
                      :fee-value="maxEditedTransactionFee" :fee-currency="'GWEI'" :fee-decimals="{min: 2, max: 6}"></totals-box>

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
              <textarea id="data" class="control__input" v-model="transactionData.data" readonly="readonly"></textarea>
            </div>
          </form>
          <button class="save-button btn" @click.prevent="saveChanges" @keyup.native.enter="saveChanges">Save</button>
        </div>
      </transition>


    </div>
    <div v-else class="loading">
      <p>{{loadingText}}</p>
    </div>
  </div>
</template>

<script lang='ts'>
    import {Component} from 'vue-property-decorator';
    import Numpad from '../../components/molecules/Numpad.vue';
    import SignTransactionView from './SignTransactionView';
    import AddressCard from '../../components/atoms/AddressCard.vue';
    import FromTo from '../../components/molecules/FromTo.vue';
    import TotalsBox from '../../components/atoms/TotalsBox.vue';
    import VueSlider from 'vue-slider-component';
    import Utils from '../../utils/Utils';
    import Api from '../../api';

    declare const window: Window;

    @Component({
                   components: {
                       TotalsBox,
                       FromTo,
                       AddressCard,
                       Numpad,
                       VueSlider,
                   },
               })
    export default class SignEthereumTransactionView extends SignTransactionView {

        public showAdvanced: boolean = false;
        public gasLimit: number = 0;
        public gasPrice: number = 0;

        private speedSelectorOptions: any = {
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

        public created() {
            this.onTransactionDataReceivedCallback = (transactionData: any): void => {
                this.gasLimit = transactionData.gas;
                this.gasPrice = this.gasPriceInGWei();
            };
            this.postTransaction = (pincode: string, transactionData: any) => Api.signTransaction(transactionData, pincode);
        }

        public get fromAddress(): string {
            return !(!super.transactionWallet) ? super.transactionWallet.address : '0x0000000000000000000000000000000000000000';
        }

        private maxTransactionFee(): number {
            return (this.transactionData.gas * this.gasPriceInGWei());
        }

        private get maxEditedTransactionFee(): number {
            return (this.gasLimit * this.gasPrice);
        }

        private get amountInEther(): number {
            return Utils.rawValue().toTokenValue(this.transactionData.value);
        }

        private gasPriceInGWei(): number {
            return Utils.rawValue().toGwei(this.transactionData.gasPrice);
        }

        private get gasOptions(): number[] {
            const originalValue: number = this.gasPriceInGWei();
            const options = [3, 3.1300001, 20, 53];
            if (options.findIndex((value: number) => value === originalValue) < 0) {
                options.push(originalValue);
            }
            return options.sort((a, b) => a - b);
        }


        private onAdvancedButtonClicked() {
            this.showAdvanced = true;
        }

        private afterAdvancedEnter() {
            (this.$refs.speedSlider as any).refresh();
        }

        private saveChanges() {
            this.transactionData.gasPrice = Utils.gwei().toRawValue(this.gasPrice);
            this.transactionData.gas = this.gasLimit;
            this.showAdvanced = false;
        }

        private doNothing() {
            // Do nothing
        }
    }
</script>

<style lang='sass' scoped>
  @import ../../assets/sass/mixins-and-vars

  .signer
    width: 100%
    margin-bottom: auto
    background-color: $color-white
    overflow: hidden

    .logo-wrapper
      height: rem(50px)
      margin-top: rem(9px)
      margin-bottom: rem(28px)
      border-bottom: 1px solid #e5e5e5
      text-align: center

      .logo
        padding: rem(5px)
        padding-bottom: rem(14px)
        max-width: rem(184px)
        max-height: rem(50px)
        @media (min-height: 600px)
          height: 60px

    .content
      width: rem(250px)
      margin: 0 auto
      display: flex

      > div
        width: 100%

      h3
        margin: 0 auto 30px auto
        font-size: rem(22px)
        line-height: normal

      .totals-box
        margin-top: rem(24px)

      .numpad
        margin-top: rem(12px)

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
          height: rem(250px)

      .save-button
        margin-top: rem(30px)


</style>
