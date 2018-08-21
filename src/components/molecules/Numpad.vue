<template>
    <div class="numpad">
        <input class="password" type="password" :value="pincode" disabled="disabled" v-if="!isError"/>
        <div class="error" v-if="isError">Pin should be between 4 and 6 numbers long.</div>
        <div class="numbers">
            <numpad-number class="number" v-for="(num, index) in numbers.slice(0,9)" :num="num" :key="num" :tabindex="index + 1"
                           @click.prevent="numberClicked(num)" @keyup.native.enter="numberClicked(num)"></numpad-number>
            <button class="btn btn--dummy" :disabled="true"></button>
            <numpad-number class="number" v-for="num in numbers.slice(9)" :num="num" :key="num" tabindex="10"
                           @click.prevent="numberClicked(num)" @keyup.native.enter="numberClicked(num)"></numpad-number>
            <button class="btn btn--revert" @click.prevent="pincode = ''" @keyup.native.enter="pincode = ''" :disabled="pincode === ''" title="reset pincode" tabindex="11">&#x2B05;</button>
        </div>
        <button class="btn btn--success" @click.prevent="sign" :disabled="pincode === ''" tabindex="12"  @keyup.native.enter="sign">sign</button>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import NumpadNumber from '@/components/atoms/NumpadNumber.vue';
    import Utils from '@/utils/Utils';
    import Api from '@/api';
    import EthereumTransactionData from '@/api/EthereumTransactionData';
    import ResponseBody from '@/api/ResponseBody';
    import {EVENT_TYPES} from '@/types/EventTypes';

    declare const window: Window;

    @Component({
        components: {
            NumpadNumber,
        },
    })
    export default class Numpad extends Vue {
        public params!: EthereumTransactionData;
        public pincode: string = '';
        public array: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        public numbers!: number[];
        public isError: boolean = false;

        private isEventSet = false;
        private event!: MessageEvent;

        public created() {
            this.numbers = Utils.shuffleArray([...this.array]);
            window.addEventListener('message', (event: MessageEvent) => {
                if (!this.isEventSet && Utils.isWhitelistedOrigin(event.origin)) {
                    const data = event.data;
                    if (data && data.type === EVENT_TYPES.SEND_PARAMS) {
                        this.params = Object.assign(new EthereumTransactionData(), data.params);
                        this.event = event;
                        this.isEventSet = true;
                    }
                }
            }, false);
            window.addEventListener('beforeunload', () => {
                (this.event.source as Window).postMessage({
                    type: EVENT_TYPES.POPUP_CLOSED,
                }, this.event.origin);
            });
        }

        public sendTransactionSigned(result: ResponseBody) {
            (this.event.source as Window).postMessage({
                type: EVENT_TYPES.TRANSACTION_SIGNED,
                data: result,
            }, this.event.origin);
            this.isEventSet = false;
        }

        public numberClicked(num: number) {
            this.isError = false;
            this.pincode += num;
        }

        public sign() {
            if (/^[0-9]{4,6}$/.test(this.pincode)) {
                Api.signEthereumTransaction(this.params, this.pincode).then((r: ResponseBody) => {
                    this.sendTransactionSigned(r);
                }).catch((e: Error) => {
                    this.sendTransactionSigned({
                        success: false,
                        result: {},
                        errors: [e],
                    });
                });
            } else {
                this.isError = true;
                this.pincode = '';
            }
        }
    }
</script>

<style scoped lang="sass">
    *
        box-sizing: border-box

    .numpad
        margin: 0 auto
        max-width: 300px

    .numbers
        display: flex
        flex-wrap: wrap
        justify-content: center

    .password
        width: 100%
        font-size: 25px
        border: 0 none
        text-align: center

        @media (min-height: 600px)
            font-size: 50px

    .error
        text-align: center
        color: red
        font-size: 12px
        display: block
        height: 30px
        @media (min-height: 600px)
            height: 60px
            font-size: 16px

    .btn,
    .number
        cursor: pointer
        background-color: black
        color: white
        font-weight: bold
        border: 1px solid white
        border-radius: 10px
        padding: 10px
        height: 40px
        flex-basis: calc(33.333333% - 10px)
        margin: 5px
        display: flex
        justify-content: center
        align-items: center
        @media (min-height: 600px)
            height: 60px

    .btn
        &--success
            width: calc(100% - 10px)
            color: white
            background-color: green
        &--revert
            color: white
            background-color: #0a77be

        &:disabled
            background-color: lightgray
            color: black
            cursor: not-allowed
</style>
