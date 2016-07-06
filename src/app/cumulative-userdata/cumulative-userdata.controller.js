(function() {
  'use strict';

  var today = new Date(),
      defaultLineChartStartDate = new Date(new Date(today).setMonth(today.getMonth()-1)),
      defaultPieChartStartDate = new Date('2015-11-01');

  function CumulativeUserDataController(CumulativeUserData, LinechartUtils, PiechartUtils, APP_CONFIG, $filter, CSVparserUtils) {
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

    vm.availableRanges = ['daily', 'weekly', 'monthly', 'yearly'];
    vm.availablePieChartFilters = ['role', 'device', 'country'];
    vm.availablePaid = ['free', 'paid', 'basic', 'standard', 'premium'];

    vm.selectedLineChartFilter = 'all';

    vm.selectedRange = 'daily';
    vm.selectedPaidFilter = 'all';

    vm.currentUsers = {
      value:0,
      first:0
    };

    // Line Chart
    vm.cumulativeUserDataForLineChart = {
      name: 'User Signups',
      data: [[new Date().getTime(), 0]],
      id: 'user-signups',
      color: APP_CONFIG.COLORS[2]
    };

    vm.reversedData;
    vm.reversedDataContainer = [];

    vm.lineChartData = [
      vm.cumulativeUserDataForLineChart
    ];

    vm.lineChartConfig = new LinechartUtils.LineChartConfig(vm.lineChartData, null, true);

    vm.lineChartFilter = lineChartFilter;
    vm.selectDropdownRange = selectDropdownRange;
    vm.getDateColor = getDateColor;
    vm.getTableIndex = getTableIndex;
    vm.pageChanged = pageChanged;
    vm.fetchAndDownloadCSV = fetchAndDownloadCSV;

    init();

    function init() {
      lineChartFilter();
    }

    function getTableIndex(index) {
      return (vm.currentPage - 1) * vm.pageSize + index;
    }


    function lineChartFilter() {
      CumulativeUserData.getCumulativeUserData(vm.cumulativeUserDataForLineChart,
                                               vm.selectedRange,
                                               vm.selectedPaidFilter,
                                               vm.dateRange.startDate,
                                               vm.dateRange.endDate).then(function (result) {
        if (result.name === 'success') {
          setReversedContainer();
        }
      });
    }

    function setReversedContainer() {
      vm.reversedData = [];
      vm.reversedData = vm.cumulativeUserDataForLineChart.data.reverse();
      vm.totalItem = vm.reversedData.length - 1;
      pageChanged(1)
    }

    function pageChanged(currentPage) {
      vm.currentPage = currentPage;
      vm.reversedDataContainer = [];
      var start = (vm.currentPage - 1) * vm.pageSize;
      for (var i = start; i < start + vm.pageSize; i++) {
        if (vm.reversedData.length === 0) {
          break
        }
        if (i === vm.totalItem) {
          vm.reversedDataContainer.push([
            vm.reversedData[i][0],
            vm.reversedData[i][1],
            '-'
          ]);
          break
        } else {
          vm.reversedDataContainer.push([
            vm.reversedData[i][0],
            vm.reversedData[i][1],
            vm.reversedData[i][1] - vm.reversedData[i+1][1],
            (vm.reversedData[i][1] - vm.reversedData[i+1][1]) / vm.reversedData[i+1][1]
          ]);
        }
      }
    }

    function selectDropdownRange(range) {
      vm.selectedRange = range;
      lineChartFilter();
    }

    function fetchAndDownloadCSV(dataContainer) {
      var copyContainer = [],
          fields;
      fields = ['date', 'totalUsers', 'changeNet/%'];
      dataContainer.forEach(function (item, i) {
        var tmp = [];
        tmp[0] = item[0];
        tmp[1] = item[1];
        tmp[2] = item[2] + '/' + (item[3] * 100).toFixed(2) + '%';
        copyContainer.push(tmp);
      });

      CSVparserUtils.downloadCSV2(copyContainer,
          false,
          'cumulative_userdata_' +
          vm.selectedRange +
          '_' + vm.selectedLineChartFilter + '.csv',
          fields);
    }


    function getDateColor(date) {
      date = getDateInNumbers(date);
      if (date === 6){
        return { 'color':'blue' };
      } else if (date === 0){
        return { 'color':'red' };
      } else {
        return { 'color':'black' };
      }
    }

    function getDateInNumbers(date) {
      var result = new Date(date);
      return result.getDay()
    }

  }

  CumulativeUserDataController.$inject = ['CumulativeUserData', 'LinechartUtils', 'PiechartUtils', 'APP_CONFIG', '$filter','CSVparserUtils'];

  angular.module('dataDashboard.cumulativeUserData.controller.CumulativeUserDataController', [])
    .controller('CumulativeUserDataController', CumulativeUserDataController);
})();
