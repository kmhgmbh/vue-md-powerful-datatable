<template>
  <div id='app' class='component'>
    <VueMdPowerfulDatatable
      :headData="birdsHeadData"
      :data="birds"
      selectable=true
      selectedRowIndexKey="name"
      max=10
      v-on:rowSelectionChange="selectedRowsChanged">
    </VueMdPowerfulDatatable>
  </div>
</template>

<script>
import Faker from 'faker';

import VueMdPowerfulDatatable from './data-table/VueMdPowerfulDatatable';

const birds = [];

const varieties = [
  'Owl',
  'Eagle',
  'Peacock',
  'Woodpecker',
  'Cockoo',
  'Parrot',
];

const numberOfRows = 100;

for (let i = 0; i < numberOfRows; i += 1) {
  birds.push({
    name: Faker.name.firstName(),
    variety: varieties[Math.floor(Math.random() * 5)],
    size: Math.floor((Math.random() * 1000) + 1500),
    extinct: Math.floor((Math.random() * 3) - 1),
    wingCount: 2,
  });
}

export default {
  name: 'app',

  components: {
    VueMdPowerfulDatatable,
  },

  data() {
    return {
      birds,
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
          key: 'extinct',
          onlyState: true,
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
  methods: {
    selectedRowsChanged(rows) {
      console.log(rows);
    },
  },
};
</script>
