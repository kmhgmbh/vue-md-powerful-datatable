<template>
  <div id='app' class='component'>
    <div class="main-content">
      <md-layout>
        <VueMdPowerfulDatatable
          :headData="birdsHeadData"
          :data="birds"
          selectable=true
          selectedRowIndexKey="id"
          :max="maxRows"
          ref="birdsTable"
          v-on:rowSelectionChange="selectedRowsChanged"
        >
        </VueMdPowerfulDatatable>

        <md-layout md-gutter>
          <md-layout md-flex-xsmall="100" md-flex-small="33" md-flex-medium="33">
            <md-input-container>
              <label>Number of Birds</label>
              <md-input type="number" v-model="numBirds"></md-input>
            </md-input-container>
          </md-layout>
          <md-layout md-flex-xsmall="100" md-flex-small="33" md-flex-medium="33">
            <md-input-container>
              <label>Number of Rows</label>
              <md-input type="number" v-model="maxRows"></md-input>
            </md-input-container>

          </md-layout>
          <md-layout md-flex-xsmall="100" md-flex-small="33" md-flex-medium="33">
            <mdl-button @click.native="generateRandomData()">
              Generate Random Data
            </mdl-button>
          </md-layout>
          <md-layout md-flex-xsmall="100" md-flex-small="33" md-flex-medium="33">
            <mdl-button @click.native="addRandomData()">
              Add Random Data
            </mdl-button>
          </md-layout>
        </md-layout>

        <md-layout md-flex-xsmall="100" md-flex-small="33" md-flex-medium="33">
          <mdl-button @click.native="setAllSelected()">
            Select All
          </mdl-button>
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
      numBirds: 10,
      maxRows: 10,
      birdsHeadData: [
        {
          key: 'id',
          name: 'Database ID',
        },
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

    setAllSelected() {
      this.$refs.birdsTable.selectAllRowsFlag = !this.$refs.birdsTable.selectAllRowsFlag;
      this.$refs.birdsTable.toggleSelectAllRows();
    },

    addRandomData() {
      const birdsBefore = this.birds.slice(0);
      const newBirds = [];

      for (let i = 0; i < this.numBirds; i += 1) {
        newBirds.push({
          id: `${i}`,
          name: Faker.name.firstName(),
          variety: varieties[Math.floor(Math.random() * 5)],
          size: Math.floor((Math.random() * 1000) + 1),
          extinct: Math.floor((Math.random() * 3) - 1),
          wingCount: 2,
        });
      }

      this.birds = birdsBefore.concat(newBirds);
    },

    generateRandomData() {
      this.birds = [];

      for (let i = 0; i < this.numBirds; i += 1) {
        this.birds.push({
          id: `${i}`,
          name: Faker.name.firstName(),
          variety: varieties[Math.floor(Math.random() * 5)],
          size: Math.floor((Math.random() * 1000) + 1),
          extinct: Math.floor((Math.random() * 3) - 1),
          wingCount: 2,
        });
      }
    },
  },
};
</script>
