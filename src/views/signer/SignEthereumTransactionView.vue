<template>
  <div class="signer">
    <div class="logo-wrapper">
      <img class="logo" alt="Arkane Logo" src="../../assets/logo-arkane-animated.svg"/>
      <p>{{errorText}}</p>
    </div>
    <div v-if="isInitialised" class="content">
      <transition name="slide-left" v-if>
        <div v-if="!showAdvanced">
          <h3>Enter your pincode to sign this transaction</h3>
          <from-to :from="'0x0da0170bbce933599450c44ddd850fe9fa9f542a'" :to="transactionData.to"></from-to>
          <!--<address-card :label="'Some label'" :address="'0x0da0170bbce933599450c44ddd850fe9fa9f542a'" :stripeClass="'blue'"></address-card>-->
          <totals-box class="totals-box" :amount-value="25" :amount-currency="'ETH'" :fee-value="0.01" :fee-currency="'ETH'" :show-advanced-icon="true"
                      @advanced-clicked="showAdvanced = true"></totals-box>
          <numpad :params="transactionData"
                  @signed="sendTransactionSignedMessage"
                  @pincode_incorrect="wrongPincodeMessage"
                  @pincode_no_tries_left="noTriesLeftMessage"></numpad>
        </div>
      </transition>
      <transition name="slide-right">
        <div v-if="showAdvanced" class="advanced">
          <h3>Transaction details</h3>
          <from-to :from="'0x0da0170bbce933599450c44ddd850fe9fa9f542a'" :to="transactionData.to"></from-to>
          <totals-box class="totals-box" :amount-value="25" :amount-currency="'ETH'" :fee-value="0.01" :fee-currency="'ETH'"></totals-box>
          <vue-slider ></vue-slider>
          <a @click="showAdvanced = false">Back</a>
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

    private transactionPrice: 1;
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
</style>
