<template>
  <div class="signer">
    <div class="logo-wrapper">
      <img class="logo" alt="Arkane Logo" src="../../../assets/logo-arkane-animated.svg"/>
    </div>
    <div v-if="isInitialised" class="content">

      <transition name="slide-left">
        <ethereum-transaction-pincode-form v-if="!showAdvanced"
                                      :transaction-request="transactionRequest"
                                      :action="'sign'"
                                      :disabled="hasBlockingError"
                                      @advanced_clicked="showAdvanced = true"
                                      @pincode_entered="pinEntered">
        </ethereum-transaction-pincode-form>
      </transition>

      <transition name="slide-right" @after-enter="afterAdvancedEnter">
        <ethereum-transaction-advanced-form v-if="showAdvanced"
                                       ref="advancedForm"
                                       :transaction-request="transactionRequest"
                                       :has-transaction-request="hasTransactionRequest"
                                       :transaction-preparation="transactionPreparation"
                                       @saved="onSaved"
                                       @back_clicked="onBackClicked">
        </ethereum-transaction-advanced-form>
      </transition>

    </div>
    <div v-else class="loading">
      <p>{{loadingText}}</p>
    </div>
  </div>
</template>

<script lang='ts'>
    import {Component} from 'vue-property-decorator';
    import Numpad from '../../../components/molecules/Numpad.vue';
    import TransactionView from '../../TransactionView';
    import AddressCard from '../../../components/atoms/AddressCard.vue';
    import FromTo from '../../../components/molecules/FromTo.vue';
    import TotalsBox from '../../../components/atoms/TotalsBox.vue';
    import EthereumTransactionPincodeForm from '../../../components/organisms/transactionForms/EthereumTransactionPincodeForm.vue';
    import EthereumTransactionAdvancedForm from '../../../components/organisms/transactionForms/EthereumTransactionAdvancedForm.vue';
    import VueSlider from 'vue-slider-component';
    import Api from '../../../api/index';
    import ResponseBody from '../../../api/ResponseBody';
    import {EVENT_TYPES} from '../../../types/EventTypes';
    import EthereumTransactionPreparationDto from '../../../models/transaction/preparation/ethereum/EthereumTransactionPreparationDto';
    import EthereumTransactionRequest from '../../../api/model/ethereum/EthereumTransactionRequest';
    import GasPriceDto from '../../../models/transaction/preparation/ethereum/GasPriceDto';

    declare const window: Window;

    @Component({
        components: {
            EthereumTransactionPincodeForm,
            EthereumTransactionAdvancedForm,
            TotalsBox,
            FromTo,
            AddressCard,
            Numpad,
            VueSlider,
        },
    })
    export default class SignEthereumTransactionView extends TransactionView<EthereumTransactionRequest, EthereumTransactionPreparationDto> {

        public showAdvanced: boolean = false;

        public created() {
            this.transactionPreparationMethod = Api.prepareSignTransaction;
            this.postTransaction = Api.signTransaction;

            this.onTransactionRequestReceivedCallback = ((transactionRequest) => {
                if (!transactionRequest.data || transactionRequest.data === '') {
                    transactionRequest.data = '0x';
                }
            });
            this.onTransactionPreparationReceivedCallback = ((transactionPreparation) => {
                this.initGasLimit(transactionPreparation);
                this.initGasPrice(transactionPreparation);
                this.handleReverted(transactionPreparation);
            });
            this.onSuccesCallbackHandler = (result: ResponseBody) => {
                if (this.messagePort) {
                    this.messagePort.postMessage({type: EVENT_TYPES.TRANSACTION_SIGNED, data: result});
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
            (this.$refs.advancedForm as EthereumTransactionAdvancedForm).afterEnter();
        }

        private initGasLimit(transactionPreparation: EthereumTransactionPreparationDto) {
            if (!this.transactionRequest.gas || this.transactionRequest.gas === 0) {
                this.$set(this.transactionRequest, 'gas', transactionPreparation.gasLimit);
            }
        }

        private initGasPrice(transactionPreparation: EthereumTransactionPreparationDto) {
            if (!this.transactionRequest.gasPrice || this.transactionRequest.gasPrice === 0) {
                const defaultGasPrice = transactionPreparation.gasPrices.find((gasPrice: GasPriceDto) => gasPrice.defaultPrice);
                this.$set(this.transactionRequest, 'gasPrice', defaultGasPrice && defaultGasPrice.gasPrice);
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
  @import ../../../assets/sass/mixins-and-vars

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

</style>
