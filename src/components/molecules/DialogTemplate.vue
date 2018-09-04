<template>
    <div class="dialog">
        <div class="dialog__content">
            <slot name="aboveTitle"></slot>
            <h3 class="dialog__title" v-if="title">{{title}}</h3>
            <slot>
                <p>
                    Description
                </p>
            </slot>
        </div>
        <div class="dialog__footer" v-if="showFooter">
            <div class="dialog-poweredby">
                <span>Powered by</span>
                <svg-arkane class="dialog-poweredby__logo"></svg-arkane>
            </div>
            <div>
                <action-link type="brand-light">Terms</action-link>
                <action-link type="brand-light">Privacy</action-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import ActionLink from '@/components/atoms/ActionLink.vue';
import SvgArkane from '@/components/atoms/SvgArkane.vue';

@Component({
    components: {
        ActionLink,
        SvgArkane,
    },
})
export default class DialogTemplate extends Vue {
    @Prop({default: true})
    public showFooter!: boolean;
    @Prop()
    public title!: string;
}
</script>

<style lang="sass" scoped>
</style>