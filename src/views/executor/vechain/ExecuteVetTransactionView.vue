<template>
  <div class="executor">
    <div class="logo-wrapper">
      <img class="logo" alt="Arkane Logo" src="../../../assets/logo-arkane-animated.svg"/>
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
import Api from '../../../api/index';
import TransactionView from '../../TransactionView';
import VetTransactionPincodeForm from '../../../components/organisms/transactionForms/VetTransactionPincodeForm.vue';
import VetTransactionAdvancedForm from '../../../components/organisms/transactionForms/VetTransactionAdvancedForm.vue';
import ResponseBody from '../../../api/ResponseBody';
import {EVENT_TYPES} from '../../../types/EventTypes';
import VechainTransactionData, {VechainTransactionDataClause} from '../../../api/vechain/VechainTransactionData';
import VeChainTransactionPreparationDto from '../../../models/transaction/preparation/vechain/VeChainTransactionPreparationDto';
import GasPriceCoefDto from '../../../models/transaction/preparation/vechain/GasPriceCoefDto';

@Component({
    components: {
        VetTransactionPincodeForm,
        VetTransactionAdvancedForm,
    },
})
export default class ExecuteVetTransactionView extends TransactionView<VechainTransactionData, VeChainTransactionPreparationDto> {

    public showAdvanced: boolean = false;

    public created() {
        this.transactionPreparationMethod = Api.prepareExecuteTransaction;
        this.postTransaction = Api.executeTransaction;

        this.onTransactionPreparationReceivedCallback = ((transactionPreparation) => {
            this.initGasLimit(transactionPreparation);
            this.initGasPrice(transactionPreparation);
            this.handleReverted(transactionPreparation);
        });
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

    private initGasLimit(transactionPreparation: VeChainTransactionPreparationDto) {
        if (!this.transactionData.gas || this.transactionData.gas === 0) {
            this.$set(this.transactionData, 'gas', transactionPreparation.gasLimit);
        }
    }

    private initGasPrice(transactionPreparation: VeChainTransactionPreparationDto) {
        if (!this.transactionData.gasPriceCoef || this.transactionData.gasPriceCoef === '' || this.transactionData.gasPriceCoef === '0') {
            const defaultGasPriceCoef = transactionPreparation.gasPriceCoefficients.find((gasPriceCoef: GasPriceCoefDto) => gasPriceCoef.defaultPrice);
            this.$set(this.transactionData, 'gasPriceCoef', defaultGasPriceCoef && defaultGasPriceCoef.gasPriceCoef);
        }
    }

    private handleReverted(transactionPreparation: VeChainTransactionPreparationDto) {
        if (transactionPreparation.reverted) {
            this.$store.dispatch('setWarning', 'WARNING: This transaction will probably be reverted.');
        }
    }
}
</script>

<style lang='sass' scoped>
  @import ../../../assets/sass/mixins-and-vars

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
