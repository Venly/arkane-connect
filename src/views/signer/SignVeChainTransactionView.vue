<template>
  <div class="home">
    <div v-if="isInitialised">
      <div class="logo-wrapper">
        <img class="logo" alt="Arkane Logo" src="../../assets/logo-arkane-animated.svg"/>
        <p>{{errorText}}</p>
      </div>
      <numpad :title="'Enter your pincode to sign this transaction'"
              :params="transactionData"
              @signed="sendTransactionSignedMessage"
              @pincode_incorrect="wrongPincodeMessage"
              @pincode_no_tries_left="noTriesLeftMessage"></numpad>
    </div>
    <div v-else>
      <p>{{loadingText}}</p>
    </div>
  </div>
</template>

<script lang='ts'>
    import {Component} from 'vue-property-decorator';
    import Numpad from '../../components/molecules/Numpad.vue';
    import SignTransactionView from './SignTransactionView';

    declare const window: Window;

    @Component({
        components: {
            Numpad,
        },
    })
    export default class SignVeChainTransactionView extends SignTransactionView {

    }
</script>

<style lang='sass' scoped>
  .logo-wrapper
    margin-top: 10px
    margin-bottom: 20px
    border-bottom: 1px solid #e5e5e5
    text-align: center

    .logo
      padding: 5px
      width: auto
      height: 48px
      @media (min-height: 600px)
        height: 60px
</style>
