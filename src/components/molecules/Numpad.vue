<template>
    <div class="numpad">
        <h3>{{title}}</h3>
        <input class="password" type="password" :value="pincode" disabled="disabled" v-if="!isError"/>
        <div class="error" v-if="isError">Pin should be between 4 and 6 numbers long.</div>
        <div class="numbers">
            <numpad-number class="number" v-for="(num, index) in numbers.slice(0,9)" :num="num" :key="num" :tabindex="index + 1"
                           @click.prevent="numberClicked(num)" @keyup.native.enter="numberClicked(num)"></numpad-number>
            <button class="btn btn--dummy" :disabled="true"></button>
            <numpad-number class="number" v-for="num in numbers.slice(9)" :num="num" :key="num" tabindex="10"
                           @click.prevent="numberClicked(num)" @keyup.native.enter="numberClicked(num)"></numpad-number>
            <button class="btn btn--revert" @click.prevent="pincode = ''" @keyup.native.enter="pincode = ''" :disabled="pincode === ''" title="reset pincode" tabindex="11">
                <svg viewBox="0 0 640 512"><path fill="currentColor" d="M576 64H205.26A63.97 63.97 0 0 0 160 82.75L9.37 233.37c-12.5 12.5-12.5 32.76 0 45.25L160 429.25c12 12 28.28 18.75 45.25 18.75H576c35.35 0 64-28.65 64-64V128c0-35.35-28.65-64-64-64zm-84.69 254.06c6.25 6.25 6.25 16.38 0 22.63l-22.62 22.62c-6.25 6.25-16.38 6.25-22.63 0L384 301.25l-62.06 62.06c-6.25 6.25-16.38 6.25-22.63 0l-22.62-22.62c-6.25-6.25-6.25-16.38 0-22.63L338.75 256l-62.06-62.06c-6.25-6.25-6.25-16.38 0-22.63l22.62-22.62c6.25-6.25 16.38-6.25 22.63 0L384 210.75l62.06-62.06c6.25-6.25 16.38-6.25 22.63 0l22.62 22.62c6.25 6.25 6.25 16.38 0 22.63L429.25 256l62.06 62.06z"/></svg>
            </button>
        </div>
        <button class="action-button" @click.prevent="sign" :disabled="pincode === ''" tabindex="12"  @keyup.native.enter="sign">Sign Transaction</button>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
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
        @Prop() public title!: string;

        public params!: EthereumTransactionData;
        public pincode: string = '';
        public array: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
        public numbers!: number[];
        public isError: boolean = false;

        private isEventSet = false;
        private event!: MessageEvent;

        public created() {
            this.numbers = this.array; // Utils.shuffleArray([...this.array]);
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
    h3
        margin: 0
        font-size: 12px
        @media (min-height: 600px)
            font-size: 22px

    .numpad
        margin: 0 auto
        max-width: 225px

    .numbers
        display: flex
        flex-wrap: wrap
        justify-content: center
        margin-bottom: 40px

    .password
        font-size: 25px
        border: 0 none
        text-align: center
        margin: 5px
        border-bottom: 2px solid #e5e5e5
        width: 90%
        width: calc(100% - 10px)

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
    .action-button,
    .number
        position: relative
        cursor: pointer
        font-weight: bold
        display: flex
        justify-content: center
        align-items: center
        &:focus
            z-index: 1

    .btn,
    .number
        font-size: 30px
        width: 75px
        height: 50px
        background-color: #f3f3f3
        border: 1px solid white
        flex-basis: 33.333333%
        @media (min-height: 600px)
            font-size: 45px
            height: 75px

        svg
            color: #4a4a4a
            width: 38px
            height: auto

        &:hover, &:focus
            background-color: #e5e5e5
        &:disabled
            color: #aaa
            svg
                color: #aaa

    .action-button
        width: 100%
        border: 0 none
        border-radius: 5px
        line-height: 25px
        padding: 5px
        color: white
        background-color: #007cbb
        &:disabled
            background-color: lightgray
            color: black

    .btn,
    .action-button
        &:disabled
            pointer-events: none
            cursor: not-allowed

    .btn--dummy:disabled
        background-color: #f3f3f3
</style>
