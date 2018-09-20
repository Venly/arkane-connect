<!-- borrowed from Nuxt! -->

<template>
    <div class="progress" :style="{
    'width': percent+'%',
    'height': height,
    'background-color': canSuccess ? color : failedColor
  }"></div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {State} from 'vuex-class';

    @Component
    export default class ProgressBar extends Vue {
        public percent = 0;
        public show = false;
        public canSuccess = true;
        public duration = 3000;
        public height = '2px';
        public color = '#007cbb';
        public failedColor = '#ff2a48';

        @State
        public loading!: boolean;

        private timer: any | undefined;
        private cut = 0;

        @Watch('loading')
        public onLoadingChanged(loading: boolean, wasLoading: boolean): void {
            if (loading !== wasLoading) {
                loading ? this.start() : this.finish();
            }
        }

        public start(): this {
            this.show = true;
            this.canSuccess = true;
            if (this.timer) {
                clearInterval(this.timer);
                this.percent = 0;
            }
            this.cut = 10000 / Math.floor(this.duration);
            this.timer = setInterval(() => {
                this.increase(this.cut * Math.random());
                if (this.percent > 95) {
                    this.finish();
                }
            }, 100);
            return this;
        }

        public set(num: number): this {
            this.show = true;
            this.canSuccess = true;
            this.percent = Math.floor(num);
            return this;
        }

        public get(): number {
            return Math.floor(this.percent);
        }

        public increase(num: number): this {
            this.percent = this.percent + Math.floor(num);
            return this;
        }

        public decrease(num: number): this {
            this.percent = this.percent - Math.floor(num);
            return this;
        }

        public finish(): this {
            this.percent = 100;
            this.hide();
            return this;
        }

        public pause(): this {
            clearInterval(this.timer);
            return this;
        }

        public hide(): this {
            clearInterval(this.timer);
            this.timer = undefined;
            setTimeout(() => {
                this.show = false;
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.percent = 0;
                    }, 200);
                });
            }, 500);
            return this;
        }

        public fail(): this {
            this.canSuccess = false;
            return this;
        }
    }
</script>

<style lang="sass" scoped>
    .progress
        position: fixed
        top: 0
        left: 0
        right: 0
        height: rem(2px)
        width: 0
        transition: width 0.2s, opacity 0.4s
        opacity: 1
        background-color: #efc14e
        z-index: 999999
</style>
