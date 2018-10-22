import Vue from 'vue';
import {config, library} from '@fortawesome/fontawesome-svg-core';
import {faEnvelope} from '@fortawesome/free-regular-svg-icons';
// import {
//     faHeartRate, faPencil,  // pro
//     faClipboard, faParachuteBox, faPlus, faStar, faSlidersH,  // free
// } from '@fortawesome/free-solid-svg-icons';
import {faArrowRight, faClipboard, faParachuteBox, faPlus, faSlidersH, faStar,} from '@fortawesome/free-solid-svg-icons';
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
