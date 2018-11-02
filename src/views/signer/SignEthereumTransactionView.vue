<template>
  <div class="signer">
    <div class="logo-wrapper">
      <img class="logo" alt="Arkane Logo" src="../../assets/logo-arkane-animated.svg"/>
    </div>
    <div v-if="isInitialised" class="content">

      <transition name="slide-left">
        <eth-transaction-pincode-form v-if="!showAdvanced"
                                      :transaction-data="transactionData"
                                      :action="'sign'"
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
import Numpad from '../../components/molecules/Numpad.vue';
import TransactionView from '../TransactionView';
import AddressCard from '../../components/atoms/AddressCard.vue';
import FromTo from '../../components/molecules/FromTo.vue';
import TotalsBox from '../../components/atoms/TotalsBox.vue';
import EthTransactionPincodeForm from '../../components/organisms/transactionForms/EthTransactionPincodeForm.vue';
import EthTransactionAdvancedForm from '../../components/organisms/transactionForms/EthTransactionAdvancedForm.vue';
import VueSlider from 'vue-slider-component';
import Api from '../../api';
import ResponseBody from '../../api/ResponseBody';
import {EVENT_TYPES} from '../../types/EventTypes';
import EthTransactionPreparationDto from '../../models/transaction/preparation/ethereum/EthTransactionPreparationDto';
import EthereumTransactionData from '../../api/EthereumTransactionData';
import GasPriceDto from '../../models/transaction/preparation/ethereum/gasprice/GasPriceDto';

declare const window: Window;

@Component({
    components: {
        EthTransactionPincodeForm,
        EthTransactionAdvancedForm,
        TotalsBox,
        FromTo,
        AddressCard,
        Numpad,
        VueSlider,
    },
})
export default class SignEthereumTransactionView extends TransactionView<EthereumTransactionData, EthTransactionPreparationDto> {

    public showAdvanced: boolean = false;

    public created() {
        this.transactionPreparationMethod = Api.prepareSignTransaction;
        this.postTransaction = Api.signTransaction;
        this.onTransactionPreparationReceivedCallback = ((transactionPreparation) => {
            this.initGasLimit(transactionPreparation);
            this.initGasPrice(transactionPreparation);
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
        (this.$refs.advancedForm as EthTransactionAdvancedForm).afterEnter();
    }

    private initGasLimit(transactionPreparation: EthTransactionPreparationDto) {
        if (!this.transactionData.gas || this.transactionData.gas === 0) {
            this.$set(this.transactionData, 'gas', transactionPreparation.gasLimit);
        }
    }

    private initGasPrice(transactionPreparation: EthTransactionPreparationDto) {
        if (!this.transactionData.gasPrice || this.transactionData.gasPrice === 0) {
            const defaultGasPrice = transactionPreparation.gasPrices.find((gasPrice: GasPriceDto) => gasPrice.defaultPrice);
            this.$set(this.transactionData, 'gasPrice', defaultGasPrice && defaultGasPrice.gasPrice);
        }
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

</style>
