<template>
  <dialog-template :title="'Access to your wallets'">
    <link-wallets-form class="link-wallets-form" :wallets="wallets" :chain="chain" :thirdPartyClientId="thirdPartyClientId" walletsInline="true"
                       @linkWalletsClicked="linkWalletsClicked"></link-wallets-form>
    <div class="actions">
      <action-link :type="'muted'" @click="backClicked">Back to {{thirdPartyClientId}}</action-link>
    </div>
  </dialog-template>
</template>

<script lang="ts">
    import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
    import LinkWalletsForm from '@/components/organisms/forms/LinkWalletsForm.vue';
    import DialogTemplate from '@/components/molecules/DialogTemplate.vue';
    import ActionLink from '@/components/atoms/ActionLink.vue';
    import {Wallet} from '../../../models/Wallet';
    import {AsyncData} from '@/decorators/decorators';
    import {SecretType} from '@/models/SecretType';
    import {Chain} from '../../../models/Chain';

    @Component({
        components: {
            LinkWalletsForm,
            ActionLink,
            DialogTemplate,
        },
    })
    export default class LinkWalletsDialog extends Vue {
        @Prop()
        private wallets!: Wallet[];
        @Prop()
        private thirdPartyClientId!: string;
        @Prop()
        private chain!: Chain;

        @Emit('backClicked')
        public backClicked() {
            // left blank intentionally
        }

        private linkWalletsClicked(selectedWallets: Wallet[]) {
            this.$emit('linkWalletsClicked', {wallets: selectedWallets});
        }
    }
</script>
<style lang="sass" scoped>
  @import ../../../assets/sass/mixins-and-vars

  .container
    min-height: 100vh

  .dialog-container
    display: flex
    height: 100%
    justify-content: center
    align-items: center
    text-align: center

  .link-wallets-form
    margin-bottom: rem(15px)

  .actions
    text-align: center

  .link
    font-size: $font-size-small

</style>
