(function () {
  'use strict';
  var today = new Date();
  var defaultLineChartStartDate = new Date(new Date(today).setMonth(today.getMonth() - 1));
  var defaultPieChartStartDate = new Date('2015-11-01');
  function DownloadedCardController(DownloadedCard, LinechartUtils, PiechartUtils, APP_CONFIG, $filter, CSVparserUtils) {
    var vm = this;
    vm.currentPage = 1;
    vm.pageSize = 20;
    vm.totalItem = 0;
    vm.dateRange = {
      startDate: defaultLineChartStartDate,
      endDate: today
    };
    vm.dateRangePieChart = {
      startDate: defaultPieChartStartDate,
      endDate: today
    };
    vm.availableRanges = [
      'daily',
      'weekly',
      'monthly'
    ];
    vm.availablePaid = [
      'free',
      'paid'
    ];
    vm.availablePublishers = [];
    vm.selectedRange = 'daily';
    vm.selectedPaidFilter = 'all';
    vm.selectedPublisherFilter = -1;
    // Line Chart
    vm.downloadedCardForLineChart = {
      name: 'Downloaded Cards',
      data: [[
          new Date().getTime(),
          0
        ]],
      id: 'downloaded-cards',
      color: APP_CONFIG.COLORS[9]
    };
    vm.reversedData;
    vm.reversedDataContainer = [];
    vm.lineChartData = [vm.downloadedCardForLineChart];
    vm.lineChartConfig = new LinechartUtils.LineChartConfig(vm.lineChartData, null, true);
    vm.lineChartFilter = lineChartFilter;
    vm.selectDropdownRange = selectDropdownRange;
    vm.getDateColor = getDateColor;
    vm.getTableIndex = getTableIndex;
    vm.pageChanged = pageChanged;
    vm.fetchAndDownloadCSV = fetchAndDownloadCSV;
    vm.exportPDF = exportPDF;
    init();
    function init() {
      lineChartFilter();
      getPublisher();
    }
    function getTableIndex(index) {
      return (vm.currentPage - 1) * vm.pageSize + index;
    }
    function lineChartFilter() {
      DownloadedCard.getCumulativeUserData(vm.downloadedCardForLineChart, vm.selectedRange, vm.selectedPublisherFilter, vm.selectedPaidFilter, vm.dateRange.startDate, vm.dateRange.endDate).then(function (result) {
        if (result.name === 'success') {
          setReversedContainer();
        }
      });
    }
    function getPublisher() {
      DownloadedCard.getPublisherKeys(vm.availablePublishers, vm.dateRange.startDate, vm.dateRange.endDate);
    }
    function setReversedContainer() {
      vm.reversedData = [];
      vm.reversedData = vm.downloadedCardForLineChart.data.reverse();
      vm.totalItem = vm.reversedData.length - 1;
      pageChanged(1);
    }
    function pageChanged(currentPage) {
      vm.currentPage = currentPage;
      vm.reversedDataContainer = [];
      var start = (vm.currentPage - 1) * vm.pageSize;
      for (var i = start; i < start + vm.pageSize; i++) {
        if (vm.reversedData.length === 0) {
          break;
        }
        if (i === vm.totalItem) {
          vm.reversedDataContainer.push([
            vm.reversedData[i][0],
            vm.reversedData[i][1],
            '-'
          ]);
          break;
        } else {
          vm.reversedDataContainer.push([
            vm.reversedData[i][0],
            vm.reversedData[i][1],
            vm.reversedData[i][1] - vm.reversedData[i + 1][1],
            (vm.reversedData[i][1] - vm.reversedData[i + 1][1]) / vm.reversedData[i + 1][1]
          ]);
        }
      }
    }
    function selectDropdownRange(range) {
      vm.selectedRange = range;
      lineChartFilter();
    }
    function exportPDF() {
      var doc = new jsPDF('p', 'pt');
      var columns = [
        'Date',
        'Downloaded Cards',
        'Change Net / %'
      ];
      var tmp = [];
      for (var i = 0; i < vm.reversedData.length; i++) {
        if (i === vm.reversedData.length - 1) {
          tmp.push([
            dateFormat(new Date(vm.reversedData[i][0])),
            vm.reversedData[i][1],
            vm.reversedData[i][1],
            '-'
          ]);
          break;
        } else {
          tmp.push([
            dateFormat(new Date(vm.reversedData[i][0])),
            vm.reversedData[i][1],
            (vm.reversedData[i][1] - vm.reversedData[i + 1][1]).toString() + ' / ' + (Math.round((vm.reversedData[i][1] - vm.reversedData[i + 1][1]) / vm.reversedData[i + 1][1] * 100) / 100).toString() + ' %'
          ]);
        }
      }
      doc.autoTable(columns, tmp, { theme: 'grid' });
      doc.save('table.pdf');
    }
    function dateFormat(date) {
      var yyyy = date.getFullYear().toString();
      var mm = (date.getMonth() + 1).toString();
      var dd = date.getDate().toString();
      return (yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0])).toString();
    }
    function fetchAndDownloadCSV(dataContainer) {
      var copyContainer = [];
      var fields;
      fields = [
        'Date',
        'downloaded Cards',
        'Change Net/%'
      ];
      dataContainer.forEach(function (item, i) {
        var tmp = [];
        tmp[0] = item[0];
        tmp[1] = item[1];
        tmp[2] = item[2] + '/' + (item[3] * 100).toFixed(2) + '%';
        copyContainer.push(tmp);
      });
      CSVparserUtils.downloadCSV2(copyContainer, false, 'downloaded_cards_' + vm.selectedRange + '.csv', fields);
    }
    function getDateColor(date) {
      date = getDateInNumbers(date);
      if (date === 6) {
        return { 'color': 'blue' };
      } else if (date === 0) {
        return { 'color': 'red' };
      } else {
        return { 'color': 'black' };
      }
    }
    function getDateInNumbers(date) {
      var result = new Date(date);
      return result.getDay();
    }
  }
  DownloadedCardController.$inject = [
    'DownloadedCard',
    'LinechartUtils',
    'PiechartUtils',
    'APP_CONFIG',
    '$filter',
    'CSVparserUtils'
  ];
  angular.module('dataDashboard.downloadedCard.controller.DownloadedCardController', []).controller('DownloadedCardController', DownloadedCardController);
}());