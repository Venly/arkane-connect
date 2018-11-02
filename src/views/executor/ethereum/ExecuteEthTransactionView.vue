<template>
  <div class="executor">
    <div class="logo-wrapper">
      <img class="logo" alt="Arkane Logo" src="../../../assets/logo-arkane-animated.svg"/>
    </div>
    <div v-if="isInitialised" class="content">
      <transition name="slide-left">
        <eth-transaction-pincode-form v-if="!showAdvanced"
                                      :transaction-data="transactionData"
                                      :action="'execute'"
                                      :disabled="hasBlockingError"
                                      @advanced_clicked="showAdvanced = true"
                                      @pincode_entered="pinEntered">
        </eth-transaction-pincode-form>
      </transition>

      <transition name="slide-right" @after-enter="afterAdvancedEnter">
        <eth-transaction-advanced-form v-if="showAdvanced"
                                       ref="advancedForm"
                                       :transaction-data="transactionData"
                                       :has-transaction-data="hasTransactionData"
                                       :transaction-preparation="transactionPreparation"
                                       @saved="onSaved"
                                       @back_clicked="onBackClicked">
        </eth-transaction-advanced-form>
      </transition>

    </div>
    <div v-else class="loading">
      <p>{{loadingText}}</p>
    </div>
  </div>
</template>

<script lang='ts'>
    import {Component} from 'vue-property-decorator';
    import TransactionView from '../../TransactionView';
    import EthTransactionPincodeForm from '../../../components/organisms/transactionForms/EthTransactionPincodeForm.vue';
    import EthTransactionAdvancedForm from '../../../components/organisms/transactionForms/EthTransactionAdvancedForm.vue';
    import Api from '../../../api/index';
    import ResponseBody from '../../../api/ResponseBody';
    import {EVENT_TYPES} from '../../../types/EventTypes';
    import GasPriceDto from '../../../models/transaction/preparation/ethereum/GasPriceDto';
    import EthereumTransactionPreparationDto from '../../../models/transaction/preparation/ethereum/EthereumTransactionPreparationDto';
    import EthereumTransactionData from '../../../api/ethereum/EthereumTransactionData';

    @Component({
        components: {
            EthTransactionPincodeForm,
            EthTransactionAdvancedForm,
        },
    })
    export default class ExecuteEthTransactionView extends TransactionView<EthereumTransactionData, EthereumTransactionPreparationDto> {

        public showAdvanced: boolean = false;

        public created() {
            this.transactionPreparationMethod = Api.prepareExecuteTransaction;
            this.postTransaction = Api.executeTransaction;

            this.onTransactionDataReceivedCallback = ((transactionData) => {
                if (!transactionData.data || transactionData.data === '') {
                    transactionData.data = '0x';
                }
            });
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

        public afterAdvancedEnter() {
            (this.$refs.advancedForm as EthTransactionAdvancedForm).afterEnter();
        }

        private initGasLimit(transactionPreparation: EthereumTransactionPreparationDto) {
            if (!this.transactionData.gas || this.transactionData.gas === 0) {
                this.$set(this.transactionData, 'gas', transactionPreparation.gasLimit);
            }
        }

        private initGasPrice(transactionPreparation: EthereumTransactionPreparationDto) {
            if (!this.transactionData.gasPrice || this.transactionData.gasPrice === 0) {
                const defaultGasPrice = transactionPreparation.gasPrices.find((gasPrice: GasPriceDto) => gasPrice.defaultPrice);
                this.$set(this.transactionData, 'gasPrice', defaultGasPrice && defaultGasPrice.gasPrice);
            }
        }

        private handleReverted(transactionPreparation: EthereumTransactionPreparationDto) {
            if (transactionPreparation.reverted) {
                this.$store.dispatch('setWarning', 'WARNING: This transaction will probably be reverted.');
            }
        }
    }
</script>

<style lang='sass' scoped>
  @import "../../../assets/sass/mixins-and-vars"

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
