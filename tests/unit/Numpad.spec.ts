import {expect} from 'chai';
import {shallowMount, Wrapper} from '@vue/test-utils';
import Numpad from '@/components/molecules/Numpad.vue';

describe('Numpad.vue', () => {
    it('can enter pincode', () => {
        const wrapper: Wrapper<any> = shallowMount(Numpad);
        wrapper.vm.numberClicked(1);
        wrapper.vm.numberClicked(4);
        wrapper.vm.numberClicked(2);
        wrapper.vm.numberClicked(7);
        expect(wrapper.vm.$data.pincode).to.eql('1427');
    });
    it('when pin to short or to long, reset pin and show error', () => {
        const wrapper: Wrapper<any> = shallowMount(Numpad);
        wrapper.vm.numberClicked(1);
        wrapper.vm.numberClicked(4);
        wrapper.vm.numberClicked(2);
        wrapper.vm.sign();
        expect(wrapper.vm.$data.pincode).to.eq('');
        expect(wrapper.vm.$data.isError).to.eq(true, 'isError must be true');
        wrapper.vm.numberClicked(1);
        expect(wrapper.vm.$data.isError).to.eq(false, 'isError must be reset to false');
        wrapper.vm.numberClicked(4);
        wrapper.vm.numberClicked(2);
        wrapper.vm.numberClicked(1);
        wrapper.vm.numberClicked(7);
        wrapper.vm.numberClicked(9);
        wrapper.vm.numberClicked(0);
        wrapper.vm.sign();
        expect(wrapper.vm.$data.pincode).to.eq('');
        expect(wrapper.vm.$data.isError).to.eq(true, 'isError must be true');
    });
    // The numbers aren't shuffled anymore
    // it('numbers are randomly shuffles', () => {
    //     const wrapper: Wrapper<Numpad> = shallowMount(Numpad);
    //     const numbers = (wrapper.vm as any).numbers;
    //     const numberArray = wrapper.vm.$data.array;

    //     expect(numbers.length).to.eq(numberArray.length);
    //     expect(numbers.filter((n: number) => numberArray.indexOf(n) === -1)).to.eql([]);
    //     expect(numbers).to.not.eql(numberArray);
    // });
});
