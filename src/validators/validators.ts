import * as validators from 'vuelidate/lib/validators';
import Vue from 'vue';

export const isTrue = validators.helpers.withParams(
    {type: 'isTrue'},
    (value: boolean): boolean => !validators.helpers.req(value) || value,
);

export const differentFrom = (notEqualTo: string) => {
    return validators.helpers.withParams(
        {type: 'differentFrom', notEq: notEqualTo},
        function(this: Vue, value: string, parentVm: Vue): boolean {
            return value !== validators.helpers.ref(notEqualTo, this, parentVm);
        },
    );
};

export const requiredIf = (conditionFunction: () => boolean) => {
    return validators.helpers.withParams(
        {type: 'requiredIf'},
        (value: any): boolean => {
            const required = conditionFunction();
            return (required && validators.helpers.req(value)) || !required;
        },
    );
};

export const pincode = validators.helpers.withParams(
    {type: 'pincode'},
    (value: string): boolean => !validators.helpers.req(value) || /[0-9]{4,6}/.test(value),
);
