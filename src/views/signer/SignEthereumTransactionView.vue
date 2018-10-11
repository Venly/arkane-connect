<template>
  <div class="signer">
    <div class="logo-wrapper">
      <img class="logo" alt="Arkane Logo" src="../../assets/logo-arkane-animated.svg"/>
      <p>{{errorText}}</p>
    </div>
    <div v-if="isInitialised" class="content">
      <transition name="slide-left">
        <div v-if="!showAdvanced">
          <h3>Enter your pincode to sign this transaction</h3>
          <from-to :from="'0x0da0170bbce933599450c44ddd850fe9fa9f542a'" :to="transactionData.to"></from-to>
          <!--<address-card :label="'Some label'" :address="'0x0da0170bbce933599450c44ddd850fe9fa9f542a'" :stripeClass="'blue'"></address-card>-->
          <totals-box class="totals-box" :amount-value="25" :amount-currency="'ETH'" :fee-value="0.01" :fee-currency="'ETH'" :show-advanced-icon="true"
                      @advanced-clicked="onAdvancedButtonClicked()"></totals-box>
          <numpad :params="transactionData"
                  @signed="sendTransactionSignedMessage"
                  @pincode_incorrect="wrongPincodeMessage"
                  @pincode_no_tries_left="noTriesLeftMessage"></numpad>
        </div>
      </transition>
      <transition name="slide-right" @after-enter="afterAdvancedEnter">
        <div v-if="showAdvanced" class="advanced">
          <h3>Transaction details</h3>

          <from-to :from="'0x0da0170bbce933599450c44ddd850fe9fa9f542a'" :to="transactionData.to"></from-to>

          <totals-box class="totals-box" :amount-value="25" :amount-currency="'ETH'" :fee-value="0.01" :fee-currency="'ETH'"></totals-box>

          <div class="speed-slider-box">
            <vue-slider ref="speedSlider" class="speed-slider" v-model="speed" v-bind="speedSelectorOptions"></vue-slider>
            <div class="speed-slider-box--labels">
              <div>slow</div>
              <div>fast</div>
            </div>
          </div>

          <form class="form">
            <div class="gas-limit control">
              <label for="gas-limit" class="control__label">Gas limit</label>
              <input id="gas-limit" class="control__input" type="number" v-model="gasLimit"/>
            </div>

            <div class="data control">
              <label for="data" class="control__label">Data</label>
              <textarea id="data" class="control__input" v-model="data" readonly="readonly"></textarea>
            </div>
          </form>
          <button class="save-button btn" @click.prevent="showAdvanced = false" @keyup.native.enter="showAdvanced = false">Save</button>
        </div>
      </transition>
    </div>
    <div v-else class="loading">
      <p>{{loadingText}}</p>
    </div>
  </div>
</template>

<script lang='ts'>
    import {Component, Watch} from 'vue-property-decorator';
    import Numpad from '../../components/molecules/Numpad.vue';
    import SignTransactionView from './SignTransactionView';
    import AddressCard from '../../components/atoms/AddressCard.vue';
    import FromTo from '../../components/molecules/FromTo.vue';
    import TotalsBox from '../../components/atoms/TotalsBox.vue';
    import VueSlider from 'vue-slider-component';

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

        private showAdvanced: boolean = false;
        private speed: number = 0;
        private gasLimit: number = 21000;
        private data: string = '0x606060405260008060146101000a81548160ff0219169083151502179055506001600960006101000a81548160ff021916908315150217905550341561004457600080f' +
            'd5b6040516' +
            '0c080611eff83398101604052808051906020019091908051906020019091908051906020019091908051906020019091908051906020019091908051906020019091905050336000806101000a8' +
            '1548173ff' +
            'fffffffffffffffffff ';

        private speedSelectorOptions: any = {
            eventType: 'auto',
            piecewise: true,
            dotSize: 16,
            show: true,
            speed: 1,
            tooltipDir: 'top',
            formatter: ((value: number) => `${value} Gwei`),
            data: [
                '3',
                '3.1300001',
                '19.841269841',
                '23',
            ],
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

        private onAdvancedButtonClicked() {
            this.showAdvanced = true;
        }

        private afterAdvancedEnter() {
            (this.$refs.speedSlider as any).refresh();
        }

    }
</script>

<style lang='sass' scoped>
  @import ../../assets/sass/mixins-and-vars

  .signer
    width: 100%
    margin-bottom: auto
    background-color: $color-white

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
          font-size: 12px
          color: $color-warm-gray

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
