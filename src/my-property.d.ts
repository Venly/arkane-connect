import Vue from 'vue';
import {ValidationRule} from 'vuelidate';

declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        name?: string;
        title?: any;
        asyncData?: any;
        validations?: ValidationRule[] | undefined;
    }
}
