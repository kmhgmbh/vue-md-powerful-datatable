import VueMdPowerfulDatatable from './data-table/VueMdPowerfulDatatable';

// expose component to global scope
if (typeof window !== 'undefined' && window.Vue) {
  /* eslint-disable */
  Vue.component('vue-md-powerful-datatable', VueMdPowerfulDatatable);
  /* eslint-enable */
}

/* eslint import/prefer-default-export: 0 */
export {
  VueMdPowerfulDatatable,
};

export default VueMdPowerfulDatatable;
