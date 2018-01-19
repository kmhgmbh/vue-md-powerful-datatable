<template>
  <div v-if="show" class="data-table">
    <div class="inner">
      <table>

        <!-- TABLE HEAD -->
        <tr class="table-header">
          <th v-if="selectable" class="selection-column" :style="dynamicWidth">
            <mdl-checkbox v-model="selectAllRowsFlag"></mdl-checkbox>
          </th>
          <th @click="sort(head)" :class="{searchMode: getSearchContainer(id + '_search_container_' + encode(head.key, true)), sortable: !head.keys && sortable}" v-for="head in headData" v-if="(head.keys && icons) || (!head.keys && !ignore(head.key))" :style="dynamicWidth">
            <md-layout md-row style="max-width: 100%">
              <md-icon v-if="sortedAsc(head) && sortable" class="no-selection">arrow_drop_down</md-icon>
              <md-icon v-else-if="sortedDesc(head) && sortable" class="no-selection">arrow_drop_up</md-icon>
              <md-icon v-else-if="!head.keys && sortable" class="no-selection right">arrow_drop_down</md-icon>
              <div v-if="!head.keys" class="headname no-selection">
                <div class="title" :title="head.name">{{ head.name }}</div>

                <md-input-container v-if="getSearchContainer(id + '_search_container_' + encode(head.key, true))" :id="id + '_search_container_' + encode(head.key, true)" md-inline>
                  <label>Suchen...</label>
                  <md-layout>
                    <md-input :id="id + '_search_input_' + encode(head.key, true)" @click.native.stop.prevent="" @input="updateSearchColumnFilter($event, head.key)" @propertychange="updateSearchColumnFilter($event, head.key)"></md-input>
                  </md-layout>
                </md-input-container>

              </div>
              <span v-else class="headname no-selection">{{ emptyHead }}</span>
              <md-icon v-if="!getSearchContainer(id + '_search_container_' + encode(head.key, true)) && !head.keys && search" :id="id + '_search_icon_' + encode(head.key, true)" @click.native.stop.prevent="setSearchContainer(id + '_search_container_' + encode(head.key, true))" class="no-selection search">search</md-icon>
              <md-icon v-if="getSearchContainer(id + '_search_container_' + encode(head.key, true)) && !head.keys && search" :id="id + '_search_close_' + encode(head.key, true)" @click.native.stop.prevent="clearSearchContainer(id + '_search_container_' + encode(head.key, true), head.key)" class="no-selection search">close</md-icon>
            </md-layout>
          </th>
        </tr>

        <!-- TABLE COLUMN SEARCH MOBILE -->
        <tr v-if="search" class="table-row search-row">
          <td v-if="selectable" :style="dynamicWidth"></td>
          <td v-for="column, column_index in data[0]" v-if="!ignore(column_index)" :style="dynamicWidth">
            <div v-for="head in headData" v-if="head.key === column_index && !ignore(column_index)" class="columnHead">
              {{ head.name || emptyHead }}
            </div>
            <md-input-container md-inline md-clearable>
              <label>Suchen...</label>
              <md-input @input="updateSearchColumnFilter($event, column_index)" @propertychange="updateSearchColumnFilter($event, column_index)"></md-input>
            </md-input-container>
          </td>
          <td :class="{hasIcon: true, hideMobile: true}" v-for="head, head_index in headData" v-if="head.keys" :style="dynamicWidth">
            <div class="columnHead">{{ emptyHead }}</div>
          </td>
        </tr>

        <!-- TABLE CONTENT ROWS -->
        <template v-for="row, rowIndex in (sortedData.length === 0 ? data : sortedData)" v-if="columnFilterMatched(row) && rowOnCurrentPage(rowIndex)">

          <!-- ROW -->
          <tr :id="rowId(rowIndex)" class="table-row" :class="{active: isVisibleBlock(rowIndex) && withBlock, noHover: !withBlock}" :style="dynamicWidth">
            <td v-if="selectable" class="selection-column">
              <mdl-checkbox @click.native="toggleDataRowSelection(row, rowIndex, $event)" v-model="selectedRows" :val="rowIndex"></mdl-checkbox>
              <!-- <md-checkbox @change="toggleDataRowSelection(row, rowIndex)" v-model="selectedRows[rowIndex]"></md-checkbox> -->
            </td>
            <td @click="!column.keys && toggleBlock(rowIndex, row)" v-for="column, columnIndex in headData" :class="{hasIcon: (column.keys && icons)}" :style="dynamicWidth">

              <div class="columnHead">
                {{ column.name || emptyHead }}
              </div>
               <!-- Handle CTA's -->
              <div v-if="column.keys && icons">
                  <md-icon v-for="ikey in column.keys"
                           key="icon"
                           v-if="isActionActive(ikey, row)"
                           @click.native.stop.prevent="triggerCTA(ikey, row)">{{ getIconName(ikey.name, rowIndex) }}</md-icon>
                  <md-icon class="disabled" v-else-if="!isActionHidden(ikey, row)">{{ getIconName(ikey.name, rowIndex) }}</md-icon>
              </div>
               <!-- Handle state flags  -->
              <div class="onlyState" v-else-if="column.onlyState && column.onlyState === true">
                <md-icon :class="lensColor(column, row[column.key])">lens</md-icon>
              </div>
              <!-- Format output -->
              <div v-else-if="column.format">
                {{column.format(row[column.key])}}
              </div>
              <!-- Display data -->
              <div v-else v-html="highlight(column.key, row[column.key])"></div>
            </td>
          </tr>

          <!-- ROW INNER CONTENT BLOCK -->
          <transition name="block-fade-up">
            <tr v-if="isVisibleBlock(rowIndex) && withBlock" class="block">
              <td colspan="100%">
                <slot></slot>
              </td>
            </tr>
          </transition>

        </template>

        <tr v-if="data.length === 0">
          <td colspan="100%" class="noData">
            Keine Daten verfügbar
          </td>
        </tr>
      </table>

      <!-- TABLE ADD LINE -->
      <!-- <div v-if="Object.keys(addRowButton).length > 0" class="add-row">
        <mdl-button class="add" @click.native="addRowButton.action">
          <md-icon>add</md-icon> {{ addRowButton.label }}
        </mdl-button>
      </div>-->
    </div>

    <!-- TABLE PAGER -->
    <div v-if="shouldPagerBeDisplayed" class="data-table-pager">
      <mdl-button class="grey" :disabled="page <= 1" @click.native="pagerPrev()">
        <md-icon>chevron_left</md-icon>
      </mdl-button>
      <mdl-button v-for="pagenumber in pages" :key="pagenumber" class="grey" :class="{active: pagenumber === page}" @click.native="page = pagenumber">
        {{ pagenumber }}
      </mdl-button>
      <mdl-button class="grey" :disabled="page >= pages" @click.native="pagerNext()">
        <md-icon>chevron_right</md-icon>
      </mdl-button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

Vue.config.productionTip = false;

export default {
  name: 'vue-md-powerful-datatable',

  props: {
    // data definition of columns
    headData: {
      type: Array,
      default: () => [],
    },
    // rows
    data: {
      type: Array,
      default: () => [],
    },
    // number of rows per page
    max: {
      type: Number,
      default: 20,
    },
    // activate pagination
    pager: {
      type: Boolean,
      default: true,
    },
    // array of column keys to ignore
    ignoreColumns: {
      type: Array,
      default: () => [],
    },
    // ?
    addRowButton: {
      type: Object,
      default: () => {},
    },
    // activate search feature
    search: {
      type: Boolean,
      default: true,
    },
    // activate icon feature
    icons: {
      type: Boolean,
      default: true,
    },

    // activate sortable columns
    sortable: {
      type: Boolean,
      default: true,
    },
    // activate select feature
    selectable: {
      type: Boolean,
      default: false,
    },
    // key used by row selection
    selectedRowIndexKey: {
      type: String,
      default: null,
    },
  },

  computed: {
    pages() {
      let length = 1;
      if (this.data.length) {
        length = this.data.length / this.max;
        if (length < 1) {
          length = 1;
        }
      }
      length = Math.ceil(length);
      return length;
    },

    dynamicWidth() {
      return {
        'max-width': `${parseInt((100 / this.columnCount), 10)}%`,
      };
    },

    withBlock() {
      return !!this.$slots.default;
    },

    shouldPagerBeDisplayed() {
      return this.pager && !this.isFilterActive && this.data.length;
    },
  },

  data() {
    return {
      id: -1,
      show: true,
      searchContainer: [],
      searchColumnFilter: [],
      sortedColumns: [],
      columnCount: 0,
      page: 1,
      sortedData: [],
      visibleBlock: null,
      selectedRows: [],
      selectedRowsByIndexKey: [],
      selectAllRowsFlag: false,
      emptyHead: '...',
      columsToShow: [],
      isFilterActive: false,
    };
  },

  created() {
    this.init();
    /* eslint-disable */
    this.id = this._uid;
    /* eslint-enable */
    this.columnCount = this.headData.length;
  },

  watch: {
    selectAllRowsFlag() {
      this.selectAllRows();
    },
  },

  methods: {
    noSearchFilter() {
      return this.searchColumnFilter.filter(column => column === '').length === 0;
    },

    /**
     * Get lens color for states based on meta information
     * @param {Object} columnMeta
     * @param {any} value
     */
    lensColor(columnMeta, value) {
      let color = '';
      if (columnMeta.stateMapping) {
        const index = `${value}`; // Stringify
        if (columnMeta.stateMapping[index]) {
          color = columnMeta.stateMapping[index];
        }
      } else if (value === 1) {
        color = 'yellow';
      } else if (value === 2) {
        color = 'green';
      }
      return color;
    },

    /**
     * @name doIconAction
     * @description create an link + redirect || generate + open sidebar
     * @param {String} path
     * @param {Object} rowData
     * @fires this.linkCustom
     * @fires this.setSidebar
     */
    generateAndExecuteLink(path, rowData) {
      const newPath = path;
      /* eslint-disable */
      for (let keyIndex in path.params) {
        let key = path.params[keyIndex];
        let value = '';
        if (typeof key === 'object') {
          for (let childKeyIndex in key) {
            let childKey = key[childKeyIndex];
            value += value !== '' ? '-' : '';
            value += rowData[childKey];
          }
          newPath.params[keyIndex] = this.encode(value);
        }
        // this.linkCustom(newPath);
      }
      /* eslint-enable */
    },

    /**
     * @name encode
     * @description encode (part of) url
     * @param {String} value url/-part
     * @return {String} encoded url
     */
    encode(value, noHyphen = false) {
      if (!value) {
        return '';
      }
      let returnValue = value.toString().toLowerCase();
      returnValue = value.replace('.', '');
      returnValue = value.replace(/Ä/g, 'Ae');
      returnValue = value.replace(/ä/g, 'ae');
      returnValue = value.replace(/Ö/g, 'Oe');
      returnValue = value.replace(/ö/g, 'oe');
      returnValue = value.replace(/Ü/g, 'Ue');
      returnValue = value.replace(/ü/g, 'ue');
      returnValue = value.replace(/ß/g, 'ss');
      returnValue = value.replace(' ', '-');
      returnValue = value.replace(/[^a-z0-9-_]/gi, '');
      if (noHyphen === true) {
        returnValue = value.replace('-', '_');
      }
      return returnValue;
    },


    getIconName(icon, index) {
      if (typeof icon === 'function') {
        return icon(this.data[index]);
      }
      return icon;
    },

    /**
     * Handle CTA button click
     *
     * @param {Object} meta
     * @param {Object} rowData
     */
    triggerCTA(meta, rowData) {
      if (meta.action) {
        meta.action(rowData);
      } else if (meta.link) {
        this.generateAndExecuteLink(meta.link, rowData);
      }
    },

    /**
     * @name init
     * @description initialize this page
     * @fires this.pushBreadcrumb
     * @fires transition
     */
    init() {
      this.extractColumnsToShow();

      /* this.$nextTick(() => {
        this.show = true;
      }); */
    },

    /**
     * Extract column names which should appear in table
     */
    extractColumnsToShow() {
      this.headData.forEach((item) => {
        if (item.key) {
          this.columsToShow.push(item.key);
        }
      });
    },

    /**
     * @name ignore
     * @description check if an column should ignored
     * @requires this.ignoreColumns
     * @return {Boolean}
     */
    ignore(index) {
      return this.ignoreColumns.includes(index) || !this.columsToShow.includes(index);
    },

    rowId(index) {
      if (this.data && this.data[0]) {
        return `${this.data[0].constructor.name}-${index}`;
      }
      return `row-${index}`;
    },

    /**
     * Check if row is activated and the slot should be visible
     * @param {Number} rowIndex
     */
    isVisibleBlock(rowIndex) {
      const id = this.rowId(rowIndex);
      return this.visibleBlock === id;
    },

    /**
     * Toggle row activation and slot visibility
     * Trigger slot inherent component if appropriate method is available
     * @param {Number} rowIndex
     * @param {any} rowData
     */
    toggleBlock(rowIndex, rowData) {
      const id = this.rowId(rowIndex);

      if (this.visibleBlock === id) {
        this.visibleBlock = null;
      } else {
        this.visibleBlock = id;
        this.$nextTick(() => {
          if (this.$slots.default && this.$slots.default[0].componentInstance
            && this.$slots.default[0].componentInstance.update) {
            this.$slots.default[0].componentInstance.update(rowData);
          }
        });
      }
    },

    /**
     * @name isOnlyState
     * @description check if an column is only a state (colored ball)
     * @param {String} index
     * @requires this.headData
     * @return {Boolean}
     */
    isOnlyState(index) {
      this.headData.reduce((onlyState, column) => {
        if (column.key === index && column.onlyState) {
          return column.onlyState;
        }
        return onlyState;
      }, false);
    },

    /**
     * Check if action button/icon should be active
     * @param meta
     * @param row
     */
    isActionActive(meta, row) {
      if (meta.isActive) {
        return meta.isActive(row);
      }
      return meta.link !== '';
    },

    /**
     * Check if action button/icon should be hidden
     * @param meta
     * @param row
     */
    isActionHidden(meta, row) {
      if (meta.isHidden) {
        return meta.isHidden(row);
      }
      return false;
    },

    columnFilterMatched(row) {
      /* eslint-disable */

      return Object.keys(this.searchColumnFilter).filter((columnKey) => {
        const regExp = new RegExp(this.searchColumnFilter[columnKey], "ig");
        const result = regExp.test(row[columnKey]);
        console.log(regExp, this.searchColumnFilter[columnKey], result);
        return result;
      }).length === 0;
      // for (let column in this.searchColumnFilter) {
      //   if (row[column]
      //       .toString()
      //       .toLowerCase()
      //       .indexOf(this.searchColumnFilter[column].toLowerCase()) < 0) {
      //     return false;
      //   }
      // }
      // /* eslint-enable */
      // return true;
    },

    rowOnCurrentPage(index) {
      if (this.noSearchFilter()) {
        const max = this.page * this.max;
        const min = max - this.max;
        if (index >= min && index < max) {
          return true;
        }
        return false;
      }
      return true;
    },

    pagerPrev() {
      if (this.page > 1) {
        this.page = this.page - 1;
      }
    },

    pagerNext() {
      if (this.page < this.pages) {
        this.page = this.page + 1;
      }
    },

    selectAllRows() {
      const selectedRowsAll = [];
      this.selectedRowsByIndexKey = [];
      if (this.selectAllRowsFlag) {
        /* eslint-disable */
        for (let row in this.data) {
          selectedRowsAll.push(parseInt(row), 10);
          if (this.selectedRowIndexKey) {
            this.selectedRowsByIndexKey.push(this.data[row][this.selectedRowIndexKey]);
          }
        }
        /* eslint-enable */
        this.selectedRows = selectedRowsAll;
      } else {
        this.selectedRows = [];
      }
      this.$emit('rowSelectionChange', this.selectedRowsByIndexKey);
    },

    toggleDataRowSelection(rowData, index, event) {
      this.selectAllRowsFlag = false;
      // this.SelectedRows will be handled by checkbox
      if (event.target.type === 'checkbox' && this.selectedRowIndexKey) {
        const indexKey = rowData[this.selectedRowIndexKey];
        const keyIndex = this.selectedRowsByIndexKey.indexOf(indexKey);
        if (keyIndex >= 0) {
          this.selectedRowsByIndexKey.splice(keyIndex, 1);
        } else {
          this.selectedRowsByIndexKey.push(indexKey);
        }
        this.$emit('rowSelectionChange', this.selectedRowsByIndexKey);
      }
    },

    highlight(column, text) {
      if (this.searchColumnFilter[column] != null) {
        const pattern = this.searchColumnFilter[column];
        if (pattern !== '') {
          const index = text.toString().toLowerCase().indexOf(pattern.toLowerCase());
          if (index >= 0) {
            return `${text.toString().substring(0, index)}
              <span class="highlight">
              ${text.substring(index, index + pattern.length)}
              </span>
              ${text.substring(index + pattern.length)}`;
          }
        }
      }
      return text;
    },

    updateSearchColumnFilter(input, column) {
      this.searchColumnFilter[column] = input;
      this.isFilterActive = !this.noSearchFilter();
      this.$forceUpdate();
    },

    clearSearchContainer(id, column) {
      if (this.searchContainer.indexOf(id) > -1) {
        this.searchContainer.splice(this.searchContainer.indexOf(id), 1);
      }
      this.updateSearchColumnFilter('', column);
    },

    getSearchContainer(id) {
      return this.searchContainer.includes(id);
    },

    setSearchContainer(id) {
      this.searchContainer.push(id);
      this.$forceUpdate();
    },

    sortedAsc(head) {
      if (!head.keys) {
        if (this.sortedColumns[head.key] === 'ASC') {
          return true;
        }
      }
      return false;
    },

    sortedDesc(head) {
      if (!head.keys) {
        if (this.sortedColumns[head.key] === 'DESC') {
          return true;
        }
      }
      return false;
    },

    sort(head) {
      if (!head.keys && this.sortable) {
        if (this.sortedAsc(head)) {
          this.sortedColumns = [];
          this.sortedColumns[head.key] = 'DESC';
        } else {
          this.sortedColumns = [];
          this.sortedColumns[head.key] = 'ASC';
        }
        if (this.sortedColumns[head.key] !== null) {
          this.sortedData = this.data;
          this.sortedData.sort(this.sortData(head.key, this.sortedColumns[head.key]));
        }
        this.$forceUpdate();
      }
    },

    sortData(key, sort) {
      let sortOrder = 1;
      if (sort === 'DESC') {
        sortOrder = -1;
      }
      /* eslint-disable */
      return (a, b) => {
        const valueA = typeof a[key] === 'string' && a[key].match(/^[\d]+[.|,]?[\d]+?$/)
                     ? parseFloat(a[key])
                     : a[key];

        const valueB = typeof b[key] === 'string' && b[key].match(/^[\d]+[.|,]?[\d]+?$/)
                     ? parseFloat(b[key])
                     : b[key];

        const result = (valueA < valueB) ? -1 : (valueA > valueB) ? 1 : 0;
        return result * sortOrder;
      };
      /* eslint-enable */
    },

    getAncestor(node, tagName) {
      const tagNameUpper = tagName.toUpperCase();
      let traversingNode = node;

      while (traversingNode) {
        if (traversingNode.nodeType === 1 && traversingNode.nodeName === tagNameUpper) {
          return traversingNode;
        }
        traversingNode = traversingNode.parentNode;
      }

      return null;
    },
  },
};
</script>

<style src="./data-table.sass" lang="sass"></style>
<style src="./data-table-plugins.sass" lang="sass"></style>
