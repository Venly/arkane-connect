import Vue from 'vue';
import {config, library} from '@fortawesome/fontawesome-svg-core';
import {faEnvelope} from '@fortawesome/free-regular-svg-icons/faEnvelope';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons/faArrowRight';
import {faClipboard} from '@fortawesome/free-solid-svg-icons/faClipboard';
import {faParachuteBox} from '@fortawesome/free-solid-svg-icons/faParachuteBox';
import {faPlus} from '@fortawesome/free-solid-svg-icons/faPlus';
import {faSlidersH} from '@fortawesome/free-solid-svg-icons/faSlidersH';
import {faStar} from '@fortawesome/free-solid-svg-icons/faStar';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';

library.add(
    faEnvelope as any,
    faClipboard as any,
    // faHeartRate as any,
    faParachuteBox as any,
    faPlus as any,
    // faPencil as any,
    faStar as any,
    faSlidersH as any,
    faArrowRight as any,
);

config.autoAddCss = false;

Vue.component('font-awesome-icon', FontAwesomeIcon);
