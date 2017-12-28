<template>
  <div id="app" class="component">
    <VueMdPowerfulDatatable
      :headData="birdsHeadData"
      :data="birds"
      :max="10">
    </VueMdPowerfulDatatable>
  </div>
</template>

<script>
import VueMdPowerfulDatatable from './data-table/VueMdPowerfulDatatable';

export default {
  name: 'app',

  components: {
    VueMdPowerfulDatatable,
  },

  data() {
    return {
      birds: [
        {
          name: 'Birdy',
          variety: 'Eagle',
          size: 330,
          wingCount: 1.5,
        },
        {
          name: 'Rosa',
          variety: 'Peacock',
          size: 630,
          wingCount: 2,
        },
      ],
      birdsHeadData: [
        {
          key: 'name',
          name: 'Birds Name',
        }, {
          key: 'variety',
          name: 'Birds variety',
        }, {
          key: 'size',
          name: 'Size of Bird',
          format: (value) => {
            if (value) {
              return `${value} mm`;
            }
            return '';
          },
        }, {
          key: 'wingCount',
          name: 'Number of wings',
        }, /* {
          keys: [
            {
              key: ':icon',
              name: 'delete',
              action: (rowData) => {

              },
              isActive: (row) => {
                return row.status === 'Geplant'
              },
            },
          ],
        }, */
      ],
    };
  },
};
</script>
