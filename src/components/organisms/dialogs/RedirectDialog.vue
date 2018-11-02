<template>
    <dialog-template :title="title">
        <template slot="aboveTitle" v-if="icon">
            <div class="icon-wrapper">
                <svg-checkmark class="success" v-if="icon === 'success'"></svg-checkmark>
            </div>
        </template>
        <div class="message">
            <span v-if="timeleft > 0"><slot></slot></span>
            <span v-else>Loading <strong>{{redirectUri}}</strong> ...</span>
        </div>
    </dialog-template>
</template>
<script lang="ts">
    import SvgCheckmark from '@/components/atoms/SvgCheckmark.vue';
    import DialogTemplate from '@/components/molecules/DialogTemplate.vue';
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';

    @Component({
        components: {
            SvgCheckmark,
            DialogTemplate,
        },
    })
    export default class RedirectDialog extends Vue {
        @Prop()
        public icon!: string;
        @Prop()
        public timeleft!: number;
        @Prop()
        public title!: string;
        @Prop()
        public redirectUri!: string;

        @Watch('timeleft')
        private onTimeleftChange() {
            if (this.timeleft <= 0) {
                window.location.href = this.redirectUri;
            }
        }
    }
</script>
<style lang="sass" scoped>
    @import ../../../assets/sass/mixins-and-vars

    .message
        word-break: break-word

    .icon-wrapper
        height: rem(50px)
        margin-bottom: 20px
        > svg
            max-width: 100%
            max-height: 100%
</style>