<template>
  <div id='app' class='component'>
    <div class="main-content">
      <md-layout>
        <VueMdPowerfulDatatable
          :headData="birdsHeadData"
          :data="birds"
          selectable=true
          selectedRowIndexKey="name"
          max=10
          v-on:rowSelectionChange="selectedRowsChanged">
        </VueMdPowerfulDatatable>

        <md-layout md-gutter>
          <md-layout md-flex-xsmall="100" md-flex-small="50" md-flex-medium="50">
            <md-input-container>
              <label>Number of Birds</label>
              <md-input v-model="numBirds"></md-input>
            </md-input-container>

          </md-layout>
          <md-layout md-flex-xsmall="100" md-flex-small="50" md-flex-medium="50">
            <mdl-button @click.native="generateRandomData()">
              Generate Random Data
            </mdl-button>
          </md-layout>
        </md-layout>
      </md-layout>
    </div>
  </div>
</template>

<script>
import Faker from 'faker';

import VueMdPowerfulDatatable from './data-table/VueMdPowerfulDatatable';

const varieties = [
  'Owl',
  'Eagle',
  'Peacock',
  'Woodpecker',
  'Cockoo',
  'Parrot',
];

export default {
  name: 'app',

  components: {
    VueMdPowerfulDatatable,
  },

  data() {
    return {
      birds: [],
      numBirds: 2000,
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

  created() {
    this.generateRandomData();
  },

  methods: {
    selectedRowsChanged(rows) {
      console.log(rows);
    },

    generateRandomData() {
      this.birds = [];

      for (let i = 0; i < this.numBirds; i += 1) {
        this.birds.push({
          name: Faker.name.firstName(),
          variety: varieties[Math.floor(Math.random() * 5)],
          size: Math.floor((Math.random() * 1000) + 1500),
          extinct: Math.floor((Math.random() * 3) - 1),
          wingCount: 2,
        });
      }
    },
  },
};
</script>
