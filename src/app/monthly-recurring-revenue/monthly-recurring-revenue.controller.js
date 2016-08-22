(function () {
  'use strict';
  var today = new Date(), defaultLineChartStartDate = new Date(new Date(today).setMonth(today.getMonth() - 1)), dayInMS = 86400000, defaultPieChartStartDate = new Date('2015-11-01');
  function MonthlyRecurringRevenueController(MonthlyRecurringRevenue, LinechartUtils, PiechartUtils, APP_CONFIG, $filter, CSVparserUtils) {
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
      'monthly',
      'yearly'
    ];
    vm.availableRoles = [
      'student',
      'teacher',
      'parent'
    ];
    vm.availableDevices = [
      'android',
      'ios'
    ];
    vm.selectedRange = 'daily';
    vm.selectedType = 'User Signups';
    vm.selectedRoleFilter = 'all';
    vm.selectedDeviceFilter = 'all';
    vm.selectedPaidFilter = 'all';
    vm.currentTotalUsers = {
      value: 0,
      first: 0
    };
    vm.totalDataForLineChart = {
      name: 'Total',
      data: [],
      id: 'total',
      color: APP_CONFIG.COLORS[9]
    };
    vm.reversedTotalData = [];
    vm.reversedDataContainer = [];
    vm.lineChartData = [vm.totalDataForLineChart];
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
      MonthlyRecurringRevenue.getMRR(vm.totalDataForLineChart, 'increase', vm.selectedRange, vm.selectedDeviceFilter, vm.dateRange.startDate, vm.dateRange.endDate).then(function (result) {
        MonthlyRecurringRevenue.getMRR(vm.totalDataForLineChart, 'decrease', vm.selectedRange, vm.selectedDeviceFilter, vm.dateRange.startDate, vm.dateRange.endDate).then(function (result) {
          vm.reversedTotalData = vm.totalDataForLineChart.data.slice().reverse();
          vm.totalItem = vm.reversedTotalData.length - 1;
          pageChanged(1);
        });
      });
    }
    function pageChanged(currentPage) {
      vm.currentPage = currentPage;
      vm.reversedDataContainer = [];
      var start = (vm.currentPage - 1) * vm.pageSize;
      for (var i = start; i < start + vm.pageSize; i++) {
        if (vm.reversedTotalData.length === 0) {
          break;
        }
        if (i === vm.totalItem) {
          vm.reversedDataContainer.push([
            vm.reversedTotalData[i][0],
            vm.reversedTotalData[i][1],
            '-'
          ]);
          break;
        } else {
          vm.reversedDataContainer.push([
            vm.reversedTotalData[i][0],
            vm.reversedTotalData[i][1],
            vm.reversedTotalData[i][1] - vm.reversedTotalData[i + 1][1],
            (vm.reversedTotalData[i][1] - vm.reversedTotalData[i + 1][1]) / (vm.reversedTotalData[i][1] || 1)
          ]);
        }
      }
    }
    function selectDropdownRange(range) {
      vm.selectedRange = range;
      lineChartFilter();
    }
    function fetchAndDownloadCSV(dataContainer) {
      var copyContainer = [], fields;
      fields = [
        'date',
        'totalUsers',
        'changeNet/%'
      ];
      var prevData = dataContainer[0][3];
      dataContainer.forEach(function (item, i) {
        var changeNet = prevData - item[3];
        var percentage = (prevData - item[3]) / prevData * 100;
        var tmp = [];
        tmp[0] = item[0];
        tmp[1] = item[3];
        copyContainer.push(tmp);
        if (i === 0) {
        } else {
          copyContainer[i - 1][2] = changeNet.toString() + '/' + percentage.toFixed(2).toString() + '%';
        }
        prevData = item[3];
      });
      CSVparserUtils.downloadCSV2(copyContainer, false, 'cumulative_userdata_' + vm.selectedRange + '_' + vm.selectedLineChartFilter + '.csv', fields);
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
  MonthlyRecurringRevenueController.$inject = [
    'MonthlyRecurringRevenue',
    'LinechartUtils',
    'PiechartUtils',
    'APP_CONFIG',
    '$filter',
    'CSVparserUtils'
  ];
  angular.module('dataDashboard.monthlyRecurringRevenue.controller.MonthlyRecurringRevenueController', []).controller('MonthlyRecurringRevenueController', MonthlyRecurringRevenueController);
}());