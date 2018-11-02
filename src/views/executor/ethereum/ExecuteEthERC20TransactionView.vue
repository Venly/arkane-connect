<template>
  <div class="executor">
    <div class="logo-wrapper">
      <img class="logo" alt="Arkane Logo" src="../../../assets/logo-arkane-animated.svg"/>
    </div>
    <div v-if="isInitialised" class="content">
      <transition name="slide-left">
        <eth-transaction-pincode-form v-if="!showAdvanced"
                                      :transaction-data="transactionData"
                                      :token-balance="tokenBalance"
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
                                       :token-balance="tokenBalance"
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
import EthereumTransactionPincodeForm from '../../../components/organisms/transactionForms/EthereumTransactionPincodeForm.vue';
import EthereumTransactionAdvancedForm from '../../../components/organisms/transactionForms/EthereumTransactionAdvancedForm.vue';
import Api from '../../../api/index';
import ResponseBody from '../../../api/ResponseBody';
import {EVENT_TYPES} from '../../../types/EventTypes';
import GasPriceDto from '../../../models/transaction/preparation/ethereum/GasPriceDto';
import EthereumTransactionPreparationDto from '../../../models/transaction/preparation/ethereum/EthereumTransactionPreparationDto';
import EthereumErc20TransactionRequest from '../../../api/ethereum/EthereumErc20TransactionRequest';
import TokenBalance from '../../../models/TokenBalance';

@Component({
    components: {
        EthereumTransactionPincodeForm,
        EthereumTransactionAdvancedForm,
    },
})
export default class ExecuteEthERC20TransactionView extends TransactionView<EthereumErc20TransactionRequest, EthereumTransactionPreparationDto> {

    public showAdvanced: boolean = false;
    public tokenBalance: TokenBalance = {} as TokenBalance;

    public created() {
        this.transactionPreparationMethod = Api.prepareExecuteTransaction;
        this.postTransaction = Api.executeTransaction;

        this.onTransactionDataReceivedCallback = (async (transactionData: EthereumErc20TransactionRequest) => {
            const tokenBalanceResponse = await Api.getTokenBalance(transactionData.walletId, transactionData.tokenAddress);
            if (tokenBalanceResponse.success) {
                this.tokenBalance = Object.assign({}, this.tokenBalance, tokenBalanceResponse.result);
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
        (this.$refs.advancedForm as EthereumTransactionAdvancedForm).afterEnter();
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
