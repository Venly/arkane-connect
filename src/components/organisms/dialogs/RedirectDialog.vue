<template>
    <dialog-template :title="'Congrats!'">
        <template slot="aboveTitle" v-if="icon">
            <div class="icon-wrapper">
                <svg-checkmark class="success" v-if="icon === 'success'"></svg-checkmark>
            </div>
        </template>
        <p class="message">
            <span v-if="timeleft > 0"><slot></slot></span>
            <span v-else>Loading <strong>{{redirectUri}}</strong> ...</span>
        </p>
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
                this.$router.push({path: this.redirectUri});
            }
        }
    }
</script>
<style lang="sass" scoped>
</style>