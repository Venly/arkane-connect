<template>
    <div class="numpad">
        <input type="password" style="visibility: hidden" :disabled="disabled"/>
        <input class="password" placeholder="Please enter your PIN" @keyup.prevent.enter="pinEntered" ref="pinInput" tabindex="0" autocomplete="off" data-lpignore="true" type="password" v-model="pincode"
               :disabled="disabled"/>
        <button ref="actionButton" class="btn sign-btn" @click.prevent="pinEntered" :disabled="!isSubmitable" tabindex="1" @keyup.prevent.enter="pinEntered">{{action}} Transaction
        </button>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import NumpadNumber from '@/components/atoms/NumpadNumber.vue';
    import EthereumTransactionData from '@/api/ethereum/EthereumTransactionData';
    import VechainTransactionData from '@/api/vechain/VechainTransactionData';

    @Component({
        components: {
            NumpadNumber,
        },
    })
    export default class Numpad extends Vue {
        @Prop() private title!: string;
        @Prop() private action!: string;
        @Prop() private params!: EthereumTransactionData | VechainTransactionData;
        @Prop({required: false, default: false}) private disabled?: boolean;

        private pincode: string = '';
        private array: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
        private numbers!: number[];

        public created() {
            this.numbers = this.array;
        }

        public mounted() {
            if (!this.disabled) {
                (this.$refs.pinInput as HTMLElement).focus();
            }
        }

        public pinEntered() {
            if (/^[0-9]{4,6}$/.test(this.pincode)) {
                this.$emit('pincode_entered', this.pincode);
            } else {
                this.pincode = '';
                this.$store.dispatch('setError', 'Pin should be between 4 and 6 numbers long');
            }
        }

        private numberClicked(num: number) {
            this.pincode += num;
            (this.$refs.pinInput as HTMLElement).focus();
        }

        private resetPincode() {
            this.pincode = '';
            (this.$refs.pinInput as HTMLElement).focus();
            this.$store.dispatch('resetError');
        }

        @Watch('pincode')
        private onPincodeChange(newPincode: string, oldPincode: string): void {
            if (newPincode !== '') {
                this.$store.dispatch('resetError');
            }
        }

        private get isSubmitable() {
            return !this.disabled && this.pincode !== '' && this.pincode.length >= 4;
        }
    }
</script>

<style scoped lang="sass">
    @import ../../assets/sass/mixins-and-vars

    h3
        margin: 0
        font-size: 16px
        text-align: center
        @media (min-height: 600px)
            font-size: 22px

    .numpad
        margin: 0 auto

    .numbers
        display: flex
        margin-top: rem(20px)
        flex-wrap: wrap
        justify-content: center
        margin-bottom: rem(10px)

    .password
        font-size: 25px
        border: 0 none
        text-align: center
        border-bottom: 2px solid $color-light-grey
        width: 100%
        @media (min-height: 600px)
            font-size: 35px
        &::placeholder
            opacity: 0.5

    .error
        text-align: center
        color: red
        font-size: 12px
        display: block
        height: rem(30px)
        @media (min-height: 600px)
            height: rem(60px)
            font-size: 16px

    .numpad-btn,
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

    .numpad-btn,
    .number
        font-size: 30px
        font-weight: normal
        width: rem(75px)
        height: rem(50px)
        background-color: #f3f3f3
        color: #4a4a4a
        border: 1px solid white
        flex-basis: 33.333333%
        @media (min-height: 600px)
            font-size: 45px
            height: rem(75px)

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
        border-radius: rem(5px)
        line-height: rem(25px)
        padding: rem(5px)
        color: white
        background-color: #007cbb
        &:disabled
            background-color: lightgray
            color: $color-white

    .numpad-btn,
    .action-button
        &:disabled
            pointer-events: none
            cursor: not-allowed

    .numpad-btn--revert
        padding: rem(0 20px)

    .numpad-btn--dummy:disabled
        background-color: #f3f3f3

    .sign-btn
        margin-top: rem(30px)
        text-transform: capitalize

</style>
