<template>
  <div class="numpad">
    <h3>{{title}}</h3>
    <input type="password" style="visibility: hidden"/>
    <input class="password" @keypress.enter="sign" ref="pinInput" tabindex="0" autofocus="autofocus" autocomplete="off" data-lpignore="true" type="password" v-model="pincode" v-if="!isError"/>
    <div class="numbers">
      <numpad-number class="number" v-for="(num, index) in numbers.slice(0,9)" :num="num" :key="num" :tabindex="index + 1"
                     @click.prevent="numberClicked(num)" @keyup.native.enter="numberClicked(num)"></numpad-number>
      <button class="btn btn--dummy" :disabled="true"></button>
      <numpad-number class="number" v-for="num in numbers.slice(9)" :num="num" :key="num" tabindex="10"
                     @click.prevent="numberClicked(num)" @keyup.native.enter="numberClicked(num)"></numpad-number>
      <button class="btn btn--revert" @click.prevent="resetPincode()" @keyup.native.enter="resetPincode()" :disabled="pincode === ''" title="reset pincode" tabindex="11">
        <svg viewBox="0 0 640 512">
          <path fill="currentColor"
                d="M576 64H205.26A63.97 63.97 0 0 0 160 82.75L9.37 233.37c-12.5 12.5-12.5 32.76 0 45.25L160 429.25c12 12 28.28 18.75 45.25 18.75H576c35.35 0 64-28.65 64-64V128c0-35.35-28.65-64-64-64zm-84.69 254.06c6.25 6.25 6.25 16.38 0 22.63l-22.62 22.62c-6.25 6.25-16.38 6.25-22.63 0L384 301.25l-62.06 62.06c-6.25 6.25-16.38 6.25-22.63 0l-22.62-22.62c-6.25-6.25-6.25-16.38 0-22.63L338.75 256l-62.06-62.06c-6.25-6.25-6.25-16.38 0-22.63l22.62-22.62c6.25-6.25 16.38-6.25 22.63 0L384 210.75l62.06-62.06c6.25-6.25 16.38-6.25 22.63 0l22.62 22.62c6.25 6.25 6.25 16.38 0 22.63L429.25 256l62.06 62.06z"></path>
        </svg>
      </button>
    </div>
    <button ref="actionButton" class="action-button" @click.prevent="sign" :disabled="pincode === ''" tabindex="12" @keyup.native.enter="sign">Sign Transaction</button>
    <div class="modal" v-bind:style="{ display: modalDisplay}"></div>
  </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import NumpadNumber from '@/components/atoms/NumpadNumber.vue';
    import Api from '@/api';
    import ResponseBody from '@/api/ResponseBody';
    import EthereumTransactionData from '@/api/EthereumTransactionData';
    import VechainTransactionData from '@/api/VechainTransactionData';

    @Component({
    components: {
        NumpadNumber,
    },
})
export default class Numpad extends Vue {
    @Prop() public title!: string;
    @Prop() public params!: EthereumTransactionData | VechainTransactionData;
    public pincode: string = '';
    public array: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    public numbers!: number[];
    public modalDisplay: string = 'none';

    public created() {
        this.numbers = this.array;
    }

    public mounted() {
        (this.$refs.pinInput as HTMLElement).focus();
    }

    public numberClicked(num: number) {
        this.pincode += num;
        (this.$refs.pinInput as HTMLElement).focus();
    }

    public resetPincode() {
        this.pincode = '';
        (this.$refs.pinInput as HTMLElement).focus();
        this.$store.dispatch('resetErrorSnack');
    }

    @Watch('pincode')
    public onPincodeChange(newPincode: string, oldPincode: string): void {
        if (newPincode !== '') {
            this.$store.dispatch('resetErrorSnack');
        }
    }

    public sign() {
        if (/^[0-9]{4,6}$/.test(this.pincode)) {
            this.showModal();
            this.$store.dispatch('startLoading');
            Api.signTransaction(this.params, this.pincode).then((r: ResponseBody) => {
                this.$store.dispatch('stopLoading');
                this.modalDisplay = 'none';
                if ((!r.success) && r.result && r.result.errors && r.result.errors.map((error: any) => error.code).includes('pincode.incorrect')) {
                    this.$emit('pincode_incorrect');
                } else if (!(r.success) && r.result && r.result.errors && r.result.errors.map((error: any) => error.code).includes('pincode.no-tries-left')) {
                    this.$emit('pincode_no_tries_left');
                } else {
                    this.$emit('signed', r);
                }
            }).catch((e: Error) => {
                this.$emit('signed', {
                    success: false,
                    result: {},
                    errors: [e],
                });
            });
        } else {
            this.pincode = '';
            this.$store.dispatch('setErrorSnack', 'Pin should be between 4 and 6 numbers long');
        }
    }

    private showModal() {
        this.modalDisplay = 'block';
        (this.$refs.actionButton as HTMLElement).focus();
    }
}
</script>

<style scoped lang="sass">
    h3
        margin: 0
        font-size: 16px
        text-align: center
        @media (min-height: 600px)
            font-size: 22px

    .numpad
        margin: 0 auto
        max-width: 225px

    .numbers
        display: flex
        flex-wrap: wrap
        justify-content: center
        margin-bottom: 10px

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
        color: #4a4a4a
        border: 1px solid white
        flex-basis: 33.333333%
        @media (min-height: 600px)
            font-size: 45px
            height: 75px

        svg
            color: #4a4a4a
            width: 100%
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
            color: white

    .btn,
    .action-button
        &:disabled
            pointer-events: none
            cursor: not-allowed

    .btn--dummy:disabled
        background-color: #f3f3f3

    .modal
        position: fixed
        z-index: 1
        left: 0
        top: 0
        width: 100%
        height: 100%
        overflow: auto
        background: rgb(0,0,0)
        background: transparent\9
        background: rgba(0,0,0,0.4)
</style>
