<template>
    <div class="signer">
        <div class="logo-wrapper">
            <img class="logo" alt="Arkane Logo" src="../../assets/logo-arkane-animated.svg"/>
        </div>
        <div v-if="isInitialised" class="content">


            <transition name="slide-left">
                <div v-if="!showAdvanced">
                    <h3>Enter your pincode to sign this transaction</h3>

                    <from-to :from="fromAddress" :toAddresses="toAddresses" :max-lines="3"></from-to>

                    <totals-box :amount-value="totalAmountInVet" :amount-currency="'VET'" :amount-decimals="{min: 2, max: 3}"
                                :fee-value="maxTransactionFee()" :fee-currency="'VTHO'" :fee-decimals="{min: 2, max: 11}"
                                :show-advanced-icon="true" @advanced-clicked="showAdvanced = true"></totals-box>

                    <numpad :params="transactionData" :disabled="hasBlockingError" @pincode_entered="pinEntered"></numpad>
                </div>
            </transition>


            <transition name="slide-right">
                <div v-if="showAdvanced" class="advanced">
                    <h3>Transaction details</h3>

                    <from-to :from="fromAddress" :toAddresses="toAddresses" :max-lines="3"></from-to>

                    <totals-box :amount-value="totalAmountInVet" :amount-currency="'VET'" :amount-decimals="{min: 2, max: 3}"
                                :fee-value="maxEditedTransactionFee" :fee-currency="'VTHO'" :fee-decimals="{min: 2, max: 11}"></totals-box>

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
    import TransactionView from '../TransactionView';
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
    export default class SignVeChainTransactionView extends TransactionView {

        public showAdvanced: boolean = false;
        public gasLimit: number = 0;
        public gasPriceCoef: number = 0;

        public created() {
            this.onTransactionDataReceivedCallback = (transactionData: any): void => {
                this.gasLimit = transactionData.gas;
                this.gasPriceCoef = transactionData.gasPriceCoef;
            };
            this.postTransaction = (pincode: string, transactionData: any) => Api.signTransaction(transactionData, pincode);
        }

        public get fromAddress(): string {
            return this.transactionWallet ? this.transactionWallet.address : '0x0000000000000000000000000000000000000000';
        }

        public get toAddresses(): string[] {
            return this.transactionData ? (this.transactionData.clauses as any[]).map((clause) => clause.to) : [];
        }

        public get totalAmountInVet(): number {
            return this.transactionData
                ? Utils.rawValue().toTokenValue((this.transactionData.clauses as any[]).map((clause) => parseInt(clause.amount, 10))
                                                                                       .reduce(((amount1: number, amount2: number) => amount1 + amount2), 0))
                : 0;
        }

        private maxTransactionFee(): number {
            // Base Thor rate and tx fee
            //
            // "VeChainThor blockchain transaction consumes gas, gas is converted into VTHO based on gasPrice and account VTHO is deducted to calculate the transaction fee. The
            // calculation equation is: VTHO = (1 + gasPriceCoef/255) * baseGasPrice
            // Current mainnet set baseGasPrice to be: 1 VTHO = 1000gas (always subject to the actual network parameter). The VET transfer fee is 21000gas. If gasPriceCoef = 0,
            // the used VTHO = (1 + 0/255) * 21000/1000 = 21 VTHO
            // The priority of a transaction in transaction pool can be raised by adjusting gasPriceCoef. For example, if gasPriceCoef =128, used VTHO = (1 + 128/255) * 21000/1000
            // = 31.5 VTHO"
            return this.transactionData.gas / 1000 * (1 + this.transactionData.gasPriceCoef / 255);
        }

        private get maxEditedTransactionFee(): number {
            return this.gasLimit / 1000 * (1 + this.gasPriceCoef / 255);
        }

        private onAdvancedButtonClicked() {
            this.showAdvanced = true;
        }

        private saveChanges() {
            this.transactionData.gas = this.gasLimit;
            this.transactionData.gasPriceCoef = this.gasPriceCoef;
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
                margin-top: rem(45px)
                textarea
                    height: rem(250px)

            .save-button
                margin-top: rem(30px)
</style>
