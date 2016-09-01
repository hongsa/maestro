(function () {
  'use strict';
  function PublisherRateController(PublisherRate, PiechartUtils, APP_CONFIG, CSVparserUtils, $filter) {
    var vm = this;
    vm.currentPage = 1;
    vm.pageSize = 20;
    vm.publisherTotalItem = 0;
    vm.seriesTotalItem = 0;
    vm.selectedTypeFilter = 'all';
    vm.selectedPublisherId = 0;
    vm.selectedSeriesId = 0;
    vm.selectedPublisherFilter = '-1';
    vm.availablePublishers = [];
    vm.publisherRates = {};
    vm.sortablePublishers = [];
    vm.seriesRates = {};
    vm.sortableSeries = [];
    vm.dataContainer = [];
    vm.getPublisherRate = getPublisherRate;
    vm.getSeriesRate = getSeriesRate;
    vm.pageChanged = pageChanged;
    vm.fetchAndDownloadCSV = fetchAndDownloadCSV;
    vm.pieChartConfig = new PiechartUtils.PieChartConfig(vm.pieChartData);
    init();
    function init() {
      getPublisherRate();
      getPublisher();
    }
    function getPublisherRate() {
      PublisherRate.getPublisherRate(vm.publisherRates).then(function (result) {
        if (result.name === 'success') {
          sortable(0);
        }
      });
    }
    function getSeriesRate() {
      PublisherRate.getSeriesRate(vm.seriesRates, vm.selectedPublisherFilter).then(function (result) {
        if (result.name === 'success') {
          sortable(1);
        }
      });
    }
    function getPublisher() {
      PublisherRate.getPublisherKeys(vm.availablePublishers);
    }
    function sortable(type) {
      if (type === 0) {
        vm.sortablePublishers = [];
        for (var rate in vm.publisherRates) {
          vm.sortablePublishers.push([
            rate,
            vm.publisherRates[rate][0] / vm.publisherRates[rate][1],
            vm.publisherRates[rate][1]
          ]);
        }
        vm.publisherTotalItem = vm.sortablePublishers.length;
        vm.sortablePublishers.sort(function (a, b) {
          return b[1] - a[1];
        });
      } else {
        vm.sortableSeries = [];
        for (var rate in vm.seriesRates) {
          vm.sortableSeries.push([
            rate,
            vm.seriesRates[rate][0] / vm.seriesRates[rate][1],
            vm.seriesRates[rate][1]
          ]);
        }
        vm.seriesTotalItem = vm.sortableSeries.length;
        vm.sortableSeries.sort(function (a, b) {
          return b[1] - a[1];
        });

      }
    }
    function fetchAndDownloadCSV(dataContainer) {
      var copyContainer = [];
      var fields;
      fields = [
        vm.selectedPieChartFilter,
        'count',
        'proportion'
      ];
      dataContainer.forEach(function (item) {
        var tmp = [];
        tmp[0] = item.name;
        tmp[1] = item.y;
        tmp[2] = (getPieChartProportion(item.y) * 100).toFixed(1).toString() + '%';
        copyContainer.push(tmp);
      });
      CSVparserUtils.downloadCSV2(copyContainer, false, 'school_stats_' + vm.selectedPieChartFilter + '_count_proportion' + '.csv', fields, true);
    }
    function pageChanged(currentPage) {
      vm.currentPage = currentPage;
      vm.totalItem = vm.publisherRates.length - 1;
      vm.dataContainer = [];
      var start = (vm.currentPage - 1) * vm.pageSize;
      for (var i = start; i < start + vm.pageSize; i++) {
        if (i === vm.totalItem) {
          break;
        } else {
          if (sortable[i].recc_end === null) {
            sortable[i].recc_end = 0;
          } else {
            sortable[i].recc_end = new Date(sortable[i].recc_end);
          }
          vm.dataContainer.push([
            sortable[i].id,
            sortable[i].title,
            sortable[i].avg_rate,
            sortable[i].rate_cnt,
            sortable[i].series_id,
            sortable[i].publisher_id,
            sortable[i].grade_id,
            sortable[i].curr_type,
            sortable[i].recc_end
          ]);
        }
      }
    }
  }
  PublisherRateController.$inject = [
    'PublisherRate',
    'PiechartUtils',
    'APP_CONFIG',
    'CSVparserUtils',
    '$filter'
  ];
  angular.module('dataDashboard.publisherRate.controller.PublisherRateController', []).controller('PublisherRateController', PublisherRateController);
}());