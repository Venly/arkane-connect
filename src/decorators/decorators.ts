import {createDecorator} from 'vue-class-component';
import {ComponentOptions} from 'vue/types/options';
import {ValidationRule} from 'vuelidate';

export const Validations = createDecorator((options: ComponentOptions<any>, key) => {
    options.validations = (options.methods ? options.methods[key] : undefined) as ValidationRule[] | undefined;
});

