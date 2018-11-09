<template>
  <div class="initializer">
    <div class="logo-wrapper">
      <img class="logo" alt="Arkane Logo" src="../assets/logo-arkane-animated.svg"/>
    </div>
    <div class="content">
      <h1>Initializing...</h1>
      <div>Waiting to receive transaction data</div>
    </div>
  </div>
</template>


<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {Getter} from 'vuex-class';

    @Component
    export default class InitTransactionView extends Vue {

        @Getter
        public thirdPartyClientId!: string;

        private interval!: any;
        private timer = 0;
        private warningThreshold = 15;

        public mounted(): void {
            this.$store.dispatch('startLoading');
            this.interval = setInterval(() => {
                this.timer = this.timer + 1;
                if (this.timer > this.warningThreshold) {
                    this.$store.dispatch(
                        'setWarning',
                        `No transaction data has been received after ${this.warningThreshold} seconds. Usually, this means something has gone wrong with ${this.callerName}. ` +
                        `Please close this popup and try again. If the problem persists, please contact support via support@arkane.network.`,
                    );
                }
            }, 1000);
        }

        private get callerName(): string {
            return (this.thirdPartyClientId && this.thirdPartyClientId) || 'the application who opened this popup';
        }
    }
</script>

<style lang='sass' scoped>
  @import ../assets/sass/mixins-and-vars

  .initializer
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

</style>
