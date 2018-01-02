import Vue from 'vue';
import VueMdl from 'vue-mdl';
import VueMaterial from 'vue-material';

import Main from './main';

require('vue-material/dist/vue-material.css');

Vue.use(VueMaterial);
Vue.material.registerTheme('blue', {});

require('material-design-lite/material.min.js');
require('material-design-lite/material.min.css');

Vue.use(VueMdl);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  ...Main,
});
