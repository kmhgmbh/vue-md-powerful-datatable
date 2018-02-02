# vue-md-powerful-datatable

> A Vue.js 2.0 Component

## Development

### Roadmap
- [ ] Refactor general code (from ugly for loops to array functions etc 🙄)
- [ ] Add tests (jest maybe?)
- [ ] Refactor prop names
- [ ] Refactor CSS

### Prerequisites
- nodeJS
- VueJS material-design

  ```bash
  $ npm i vue-material
  ```

- VueJS material-design-lite

  ```bash
  $ npm install vue-mdl
  ```

## Usage

### Installation
```bash
$ npm install vue-md-powerful-datatable
```

```bash
$ yarn add vue-md-powerful-datatable
```


### Use component

- add material design icons to html
  ```html
  <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic">
  <link rel="stylesheet" href="//fonts.googleapis.com/icon?family=Material+Icons">
  ```

- add to components:
  ```javascript
  import VueMdPowerfulDatatable from 'vue-md-powerful-datatable';
  ...
  components: {
      VueMdPowerfulDatatable,
  },
  ```

- add md libs to Vue init script:

  ```javascript
  import VueMdl from 'vue-mdl';
  import VueMaterial from 'vue-material';

  require('vue-material/dist/vue-material.css');

  Vue.use(VueMaterial);
  Vue.material.registerTheme('blue', {});

  require('material-design-lite/material.min.js');
  require('material-design-lite/material.min.css');
  ```

- in template:
  ```html
  <vue-md-powerful-datatable
      :headData="birdsHeadData"
      :data="birds"
      max=10>
  </vue-md-powerful-datatable>
  ```

- data and headData in parent component
  ```javascript
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
        format: (value) => { // dynamically change format
          if (value) {
            return `${value} mm`;
          }
          return '';
        },
      }, {
        key: 'wingCount',
        name: 'Number of wings',
      },
    ],
  ```

#### Props

|property name|description|type|example|
|-------|-----|------|----|
| data | actual table data | Array | `[{ name: 'test', anotherKey: 'asd', ... }, ...]` |
| headData | table header information | Array | `[{`<br> `  key: 'name', // object's key` <br> `  name: 'Birds Name' // column title }]` |
| max | number of rows per page, default: ***20*** | Number | &nbsp; |
| ignoreColumns | hide data columns | Array|`['anotherKey', ...]` |
| search | enable search, default: ***true*** | Boolean | |
| pager | enable pagination, default: ***true*** | Boolean | |
| sortable | enable sort, default: ***true***| Boolean | |
| selectable | enable selectable rows (selectedRowIndexKey must be provided on true), default: ***false***| Boolean | | 
| selectedRowIndexKey | key name for selecting lines | String | `'name'`|
| selectAllOnlyOnPage | the "select all" checkbox in table header will only select rows on current page | Boolean | `false`|


#### Events

|event name|description|arguments|
|----------|-----------|---------|
|rowSelectionChange|Will be emitted everytime a row is selected or deselected|Array of keys of selected lines|


#### Use selectable feature
- in template:
  ```html
  <vue-md-powerful-datatable
      :headData="birdsHeadData"
      :data="birds"
      max=10

      selectable="true"
      selectedRowIndexKey="name"
      v-on:rowSelectionChange="selectedRowsChanged"
      > <!-- last 3 attributes to use feature -->
  </vue-md-powerful-datatable>
  ```

- in methods:
  ```javascript
  ...
  methods: {
    ...
    selectedRowsChanged(selectedRows) {
      console.log(selectedRows);
    },
    ...
  }
  ...
  ```
