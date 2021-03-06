<template>
  <div class="data-table">
    <div class="inner">
      <table>
        <!-- TABLE HEAD -->
        <tr class="table-header">
          <th v-if="selectable" class="selection-column" :style="dynamicWidth">
            <mdl-checkbox
              @input="toggleSelectAllRows()"
              v-model="selectAllRowsFlag">
            </mdl-checkbox>
          </th>
          <th v-if="(head.keys && icons) || (!head.keys && !ignore(head.key))" v-for="(head, hIndex) in headData" :key="'table_head_' + hIndex" :style="dynamicWidth"
            @click="sort(head)" :class="{searchMode: getSearchContainer(id + '_search_container_' + encode(head.key, true)), sortable: !head.keys && sortable}">
            <md-layout md-row style="max-width: 100%">
              <md-icon v-if="isSortedAfter(head.key) === 'DESC' && sortable" class="no-selection">arrow_drop_down</md-icon>
              <md-icon v-else-if="isSortedAfter(head.key) === 'ASC' && sortable" class="no-selection">arrow_drop_up</md-icon>
              <md-icon v-else-if="!head.keys && sortable" class="no-selection right">arrow_drop_down</md-icon>
              <div v-if="!head.keys" class="headname no-selection">
                <div class="title" :title="head.name">{{ head.name }}</div>

                <md-input-container v-if="getSearchContainer(id + '_search_container_' + encode(head.key, true))" :id="id + '_search_container_' + encode(head.key, true)" md-inline>
                  <label>Suchen...</label>
                  <md-layout>
                    <md-input :id="id + '_search_input_' + encode(head.key, true)" @input="updateSearchColumnFilter($event, head.key)" @propertychange="updateSearchColumnFilter($event, head.key)"></md-input>
                  </md-layout>
                </md-input-container>

              </div>
              <span v-else class="headname no-selection">{{ emptyHead }}</span>
              <md-icon v-if="!getSearchContainer(id + '_search_container_' + encode(head.key, true)) && !head.keys && search" :id="id + '_search_icon_' + encode(head.key, true)" @click.native.stop.prevent="setSearchContainer(id + '_search_container_' + encode(head.key, true), id + '_search_input_' + encode(head.key, true))" class="no-selection search">search</md-icon>
              <md-icon v-if="getSearchContainer(id + '_search_container_' + encode(head.key, true)) && !head.keys && search" :id="id + '_search_close_' + encode(head.key, true)" @click.native.stop.prevent="clearSearchContainer(id + '_search_container_' + encode(head.key, true), head.key)" class="no-selection search">close</md-icon>
            </md-layout>
          </th>
        </tr>

        <!-- TABLE COLUMN SEARCH MOBILE -->
        <tr v-if="search" class="table-row search-row">
          <td v-if="selectable" :style="dynamicWidth"></td>
          <td v-if="!ignore(column_index)" v-for="(column, columnIndex) in data[0]" :key="'column1_' + columnIndex" :style="dynamicWidth">
            <div v-for="(head, headIndex) in headData" :key="'head1_' + headIndex" v-if="head.key === columnIndex && !ignore(columnIndex)" class="columnHead">
              {{ head.name || emptyHead }}
            </div>
            <md-input-container md-inline md-clearable>
              <label>Suchen...</label>
              <md-input @input="updateSearchColumnFilter($event, column_index)" @propertychange="updateSearchColumnFilter($event, column_index)"></md-input>
            </md-input-container>
          </td>
          <td :class="{hasIcon: true, hideMobile: true}" v-for="(head, headIndex) in headData" :key="'head2_' + headIndex" v-if="head.keys" :style="dynamicWidth">
            <div class="columnHead">{{ emptyHead }}</div>
          </td>
        </tr>

        <!-- TABLE CONTENT ROWS -->
        <template v-for="(row, rowIndex) in rowsToShow">

          <!-- ROW -->
          <tr :key="'row_' + rowIndex" :id="rowId(rowIndex)" class="table-row" :class="{active: isVisibleBlock(rowIndex) && withBlock, noHover: !withBlock}" :style="dynamicWidth">
            <td v-if="selectable" class="selection-column">
              <mdl-checkbox
                v-model="row.$isSelected"
                @input="rowSelectInput($event, row)"
                >
              </mdl-checkbox>
            </td>
            <td @click="!column.keys && toggleBlock(rowIndex, row)" v-for="(column, columnIndex) in headData" :key="'column2_' + columnIndex" :class="{hasIcon: (column.keys && icons)}" :style="dynamicWidth">
              <div class="columnHead">
                {{ column.name || emptyHead }}
              </div>
              <!-- Handle CTA's -->
              <div v-if="column.keys && icons">
                  <md-icon v-for="(ikey, ikeyIndex) in column.keys" v-if="isActionActive(ikey, row)" :key="'icon_' + ikeyIndex"
                           @click.native.stop.prevent="triggerCTA(ikey, row)" :class="ikey.class || ''">{{ getIconName(ikey.name, rowIndex) }}</md-icon>
                  <md-icon class="disabled" v-else-if="!isActionHidden(ikey, row)" :class="ikey.class || ''">{{ getIconName(ikey.name, rowIndex) }}</md-icon>
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

      <div v-if="addRowButton" class="add-row">
        <mdl-button class="add" @click.native="addRowButton.action">
          <md-icon>add</md-icon> {{ addRowButton.label }}
        </mdl-button>
      </div>
    </div>

    <!-- TABLE PAGER -->
    <div v-if="shouldPagerBeDisplayed" class="data-table-pager">
      <mdl-button class="grey" :disabled="page <= 1" @click.native="pagerPrev()">
        <md-icon>chevron_left</md-icon>
      </mdl-button>
      <mdl-button v-for="pagenumber in pagesToShow" :disabled="pagenumber === '...'" :key="pagenumber" class="grey" :class="{active: pagenumber === page}" @click.native="gotoPage(pagenumber)">
        {{ pagenumber }}
      </mdl-button>
      <mdl-button class="grey" :disabled="page >= (allRows.length/max)" @click.native="pagerNext()">
        <md-icon>chevron_right</md-icon>
      </mdl-button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import uuid from 'uuid';

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
      default: null,
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
    // option to select only rows on page on select all checkbox
    selectAllOnlyOnPage: {
      type: Boolean,
      default: false,
    },
    // inform if table data was filtered from outside to hide visibleBlock
    externalFilterApplied: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    pages() {
      let length = 1;
      if (this.allRows.length) {
        length = this.allRows.length / this.max;
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
      return this.pager && this.data.length;
    },
  },

  watch: {
    data() {
      this.pageRows(this.page - 1);
      this.addSelectedProp(this.data.filter(row => row.$isSelected === undefined));
    },
    externalFilterApplied() {
      this.visibleBlock = null;
      this.gotoPage(1);
      this.updatePagesToShow();
    },
    // on filter skip to first page
    pages() {
      this.gotoPage(1);
      this.updatePagesToShow();
    },
  },

  data() {
    return {
      id: -1,
      allRows: [],
      rowsToShow: [],
      rowMap: new Map(),
      searchContainer: [],
      searchColumnFilter: [],
      sortedColumns: new Map(),
      columnCount: 0,
      page: 1,
      pagesToShow: [],
      sortedData: [],
      visibleBlock: null,
      selectedRows: [],
      selectedRowsByIndexKey: [],
      selectAllRowsFlag: false,
      emptyHead: '...',
      columnsToShow: [],
      isFilterActive: false,
    };
  },

  created() {
    this.init();
    /* eslint-disable */
    this.id = this._uid;
    /* eslint-enable */
    this.columnCount = this.headData.length;

    this.addSelectedProp(this.data);

    this.pageRows(0);
  },

  methods: {
    addSelectedProp(rows) {
      this.allRows.concat(rows.map((row) => {
        const generatedUuid = uuid.v4();

        const newRow = row;
        const newMapRow = {
          row: newRow,
          mutableProps: {
            isSelected: false,
          },
        };

        Object.defineProperty(newRow, '$isSelected', {
          get: () => {
            const mapRow = this.rowMap.get(generatedUuid).mutableProps;
            if (!mapRow.isSelected) {
              return false;
            }
            return mapRow.isSelected;
          },
          set: (newValue) => {
            this.$forceUpdate();
            this.rowMap.get(generatedUuid).mutableProps.isSelected = newValue;
          },
        });

        newRow.mapRef = generatedUuid;

        this.rowMap.set(generatedUuid, newMapRow);
        return newRow;
      }));
    },
    gotoPage(pageNum) {
      this.page = pageNum;
      this.pageRows(pageNum - 1);
      this.$forceUpdate();
    },
    updatePagesToShow() {
      const pageRange = [];

      const numPages = Math.ceil(this.allRows.length / this.max);
      const isNextPageInRange = this.page + 1 <= numPages;
      const isPrevPageInRange = this.page - 1 > 0;

      if (this.page - 2 > 0) {
        pageRange.push(1);
        if (this.page - 3 > 0) {
          pageRange.push('...');
        }
      }
      if (isPrevPageInRange
        && !isNextPageInRange
        && this.page - 3 > 0) {
        pageRange.push(this.page - 2);
        pageRange.push(this.page - 1);
      } else if (isPrevPageInRange) {
        pageRange.push(this.page - 1);
      }
      pageRange.push(this.page);
      if (!isPrevPageInRange
        && isNextPageInRange
        && this.page + 3 <= numPages) {
        pageRange.push(this.page + 1);
        pageRange.push(this.page + 2);
      } else if (isNextPageInRange) {
        pageRange.push(this.page + 1);
      }
      if (this.page + 2 <= numPages) {
        if (this.page + 3 <= numPages) {
          pageRange.push('...');
        }
        pageRange.push(numPages);
      }

      this.pagesToShow = pageRange;
    },

    isSortedAfter(key) {
      return this.sortedColumns.get(key);
    },

    noSearchFilter() {
      return this.searchColumnFilter.filter(column => column === '').length === 0;
    },

    orderRows(rows) {
      if (!this.sortedColumns.size) {
        return rows;
      }
      return this.orderedRows(rows, {
        column: this.sortedColumns.keys().next().value,
        order: this.sortedColumns.values().next().value,
      });
    },

    orderedRows(rows, sortSettings = null) {
      let actualSortSettings = sortSettings;
      if (!actualSortSettings) {
        actualSortSettings = {
          column: this.headData[0].key,
          order: 'ASC',
        };
      }

      let sortReturnLower = -1;
      let sortReturnHigher = 1;
      if (actualSortSettings.order === 'DESC') {
        sortReturnLower = 1;
        sortReturnHigher = -1;
      }

      return rows.sort((a, b) => {
        let valueA = a[actualSortSettings.column];
        let valueB = b[actualSortSettings.column];

        if (parseInt(a[actualSortSettings.column], 10)
          && parseInt(b[actualSortSettings.column], 10)) {
          valueA = parseInt(a[actualSortSettings.column], 10);
          valueB = parseInt(b[actualSortSettings.column], 10);
        } else {
          valueA = a[actualSortSettings.column].toString().toUpperCase();
          valueB = b[actualSortSettings.column].toString().toUpperCase();
        }

        if (valueA < valueB) {
          return sortReturnLower;
        }
        if (valueA > valueB) {
          return sortReturnHigher;
        }

        return 0;
      });
    },

    searchedRows(rows) {
      if (this.isFilterActive) {
        return rows.filter((row) => {
          let found = false;
          Object.keys(row).forEach((key) => {
            if (this.searchColumnFilter[key]) {
              /* eslint-disable */
              let convertedWildcards = this.searchColumnFilter[key].replace('*', '[\\d\\w]*');
              convertedWildcards = convertedWildcards.replace('?', '[\\d\\w]');
              /* eslint-enable */
              const regex = new RegExp(convertedWildcards, 'i');
              if (regex.test(row[key])) found = true;
            }
          });
          return found;
        });
      }
      return rows;
    },

    searchedAndOrderedRows(rows) {
      const searchedRows = this.searchedRows(rows);
      const orderedRows = this.orderRows(searchedRows);

      return orderedRows;
    },

    pagedRows(rows, { pageSize, pageNum } = {}) {
      const startIndex = pageSize * (pageNum);
      const endIndex = pageSize * (pageNum + 1);

      return this.searchedAndOrderedRows(rows).slice(startIndex, endIndex);
    },

    pageRows(pageNum) {
      const rowsClone = this.data.slice(0);

      this.rowsToShow = this.pagedRows(
        rowsClone,
        { pageSize: this.max, pageNum }
      );
      this.allRows = this.searchedAndOrderedRows(rowsClone);
      this.updatePagesToShow();
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
      meta.action(rowData);
    },

    /**
     * @name init
     * @description initialize this page
     * @fires this.pushBreadcrumb
     * @fires transition
     */
    init() {
      this.extractColumnsToShow();
    },

    /**
     * Extract column names which should appear in table
     */
    extractColumnsToShow() {
      this.headData.forEach((item) => {
        if (item.key) {
          this.columnsToShow.push(item.key);
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
      return this.ignoreColumns.includes(index) || !this.columnsToShow.includes(index);
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

    pagerPrev() {
      if (this.page - 1 > 0) {
        this.pageRows((this.page - 1) - 1);
        this.page -= 1;
      }
    },

    pagerNext() {
      if (this.page < (this.allRows.length / this.max)) {
        this.pageRows(this.page);
        this.page += 1;
      }
    },

    toggleSelectAllRows() {
      let rowsToSelect = this.allRows.slice(0);
      if (this.selectAllOnlyOnPage) {
        rowsToSelect = this.rowsToShow.slice(0);
      }
      const currentSelectedFlag = this.selectAllRowsFlag;

      /* eslint-disable */
      rowsToSelect.forEach((row) => {
        if (!currentSelectedFlag) {
          row.$isSelected = true;
        }
        if (row.$isSelected !== currentSelectedFlag) {
          row.$isSelected = currentSelectedFlag;
        }
      });
      /* eslint-enable */

      this.selectedRowsByIndexKey = this.getAllSelectedRows();
      this.$emit('rowSelectionChange', this.selectedRowsByIndexKey);
    },

    getAllSelectedRows() {
      return this.allRows.slice(0).reduce((acc, row) => {
        if (row.$isSelected) {
          acc.push(row[this.selectedRowIndexKey]);
        }
        return acc;
      }, []);
    },

    rowSelectInput() {
      this.selectAllRowsFlag = false;

      if (this.selectedRowIndexKey) {
        this.selectedRowsByIndexKey = this.getAllSelectedRows();
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
              ${text.toString().substring(index, index + pattern.length)}
              </span>
              ${text.toString().substring(index + pattern.length)}`;
          }
        }
      }
      return text;
    },

    updateSearchColumnFilter(input, column) {
      if (input === '') {
        delete this.searchColumnFilter[column];
      } else {
        this.searchColumnFilter[column] = input;
      }

      this.isFilterActive = Object.keys(this.searchColumnFilter).length > 0;
      this.pageRows(this.page - 1);
      this.visibleBlock = null;
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

    setSearchContainer(id, inputId) {
      this.searchContainer.push(id);
      this.$nextTick(() => {
        document.getElementById(inputId).focus();
      });
    },

    sortAsc(key) {
      this.sortedColumns.set(key, 'ASC');
    },

    sortDesc(key) {
      this.sortedColumns.set(key, 'DESC');
    },

    sort(head) {
      // quirk as long as the ordering only works for one key
      const foundSortColumn = this.sortedColumns.get(head.key);

      if (!foundSortColumn) {
        if (this.sortedColumns.size === 1) {
          this.sortedColumns.clear();
        }
        this.sortAsc(head.key);
      } else if (foundSortColumn === 'DESC') {
        this.sortAsc(head.key);
      } else {
        this.sortDesc(head.key);
      }
      this.pageRows(this.page - 1);
      this.visibleBlock = null;
    },
  },
};
</script>

<style src="./data-table.sass" lang="sass"></style>
<style src="./data-table-plugins.sass" lang="sass"></style>
