<template>
  <div class="executor">
    <div class="logo-wrapper">
      <img class="logo" alt="Arkane Logo" src="../../assets/logo-arkane-animated.svg"/>
    </div>
    <div v-if="isInitialised" class="content">

      <transition name="slide-left">
        <vet-transaction-pincode-form v-if="!showAdvanced"
                                      :transaction-data="transactionData"
                                      :action="'execute'"
                                      :disabled="hasBlockingError"
                                      @advanced_clicked="showAdvanced = true"
                                      @pincode_entered="pinEntered">
        </vet-transaction-pincode-form>
      </transition>


      <transition name="slide-right">
        <vet-transaction-advanced-form v-if="showAdvanced"
                                       :transaction-data="transactionData"
                                       :has-transaction-data="hasTransactionData"
                                       @saved="onSaved"
                                       @back_clicked="onBackClicked">
        </vet-transaction-advanced-form>
      </transition>

    </div>
    <div v-else class="loading">
      <p>{{loadingText}}</p>
    </div>
  </div>
</template>

<script lang='ts'>
import {Component} from 'vue-property-decorator';
import Api from '../../api';
import TransactionView from '../TransactionView';
import VetTransactionPincodeForm from '../../components/organisms/transactionForms/VetTransactionPincodeForm.vue';
import VetTransactionAdvancedForm from '../../components/organisms/transactionForms/VetTransactionAdvancedForm.vue';
import ResponseBody from '../../api/ResponseBody';
import {EVENT_TYPES} from '../../types/EventTypes';

@Component({
    components: {
        VetTransactionPincodeForm,
        VetTransactionAdvancedForm,
    },
})
export default class ExecuteVetTransactionView extends TransactionView {

    public showAdvanced: boolean = false;

    public created() {
        this.postTransaction = (pincode: string, transactionData: any) => Api.executeTransaction(transactionData, pincode);
        this.onSuccesCallbackHandler = (result: ResponseBody) => {
            if (this.messagePort) {
                this.messagePort.postMessage({type: EVENT_TYPES.TRANSACTION_EXECUTED, data: result});
            }
        };
    }

    public onAdvancedButtonClicked() {
        this.showAdvanced = true;
    }

    public onSaved() {
        this.showAdvanced = false;
    }

    public onBackClicked() {
        this.showAdvanced = false;
    }
}
</script>

<style lang='sass' scoped>
  @import ../../assets/sass/mixins-and-vars

  .executor
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
</style>
