(function () {
  'use strict';
  var today = new Date();
  var defaultStartDate = new Date(new Date(today).setMonth(today.getMonth() - 1));
  function CancelUserDataController(CancelUserData, LinechartUtils, PiechartUtils, APP_CONFIG, $filter, CSVparserUtils) {
    var vm = this;
    vm.currentPage = 1;
    vm.pageSize = 20;
    vm.totalItem = 0;
    vm.dateRange = {
      startDate: defaultStartDate,
      endDate: today
    };
    vm.dateRangePieChart = {
      startDate: defaultStartDate,
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
    vm.availablePieChartFilters = ['type'];
    vm.selectedLineChartFilter = 'all';
    vm.selectedPieChartFilter = 'type';
    vm.selectedRange = 'daily';
    vm.selectedRoleFilter = 'all';
    vm.selectedDeviceFilter = 'all';
    vm.selectedPaidFilter = 'all';
    // New Cancel Line Chart
    vm.basicToStopUserDataForLineChart = {
      name: 'Basic to Unsubscribe',
      data: [[
          new Date().getTime(),
          0
        ]],
      id: 'basic-unsubscribe',
      color: APP_CONFIG.COLORS[0]
    };
    vm.standardToStopUserDataForLineChart = {
      name: 'Standard to Unsubscribe',
      data: [[
          new Date().getTime(),
          0
        ]],
      id: 'standard-unsubscribe',
      color: APP_CONFIG.COLORS[1]
    };
    vm.premiumToStopUserDataForLineChart = {
      name: 'Premium to Unsubscribe',
      data: [[
          new Date().getTime(),
          0
        ]],
      id: 'premium-unsubscribe',
      color: APP_CONFIG.COLORS[2]
    };
    // Upgrade Cancel Line Chart
    vm.basicToRefundUserDataForLineChart = {
      name: 'Basic to Refund',
      data: [[
          new Date().getTime(),
          0
        ]],
      id: 'basic-refund',
      color: APP_CONFIG.COLORS[30]
    };
    vm.premiumToRefundUserDataForLineChart = {
      name: 'Standard to Refund',
      data: [[
          new Date().getTime(),
          0
        ]],
      id: 'standard-refund',
      color: APP_CONFIG.COLORS[1]
    };
    vm.standardToRefundUserDataForLineChart = {
      name: 'Premium to Refund',
      data: [[
          new Date().getTime(),
          0
        ]],
      id: 'premium-refund',
      color: APP_CONFIG.COLORS[2]
    };
    vm.lineChartDataLoop = [
      vm.basicToStopUserDataForLineChart,
      vm.standardToStopUserDataForLineChart,
      vm.premiumToStopUserDataForLineChart,
      vm.basicToRefundUserDataForLineChart,
      vm.standardToRefundUserDataForLineChart,
      vm.premiumToRefundUserDataForLineChart
    ];
    vm.reversedData = [];
    vm.reversedDataContainer = [];
    vm.lineChartCancelData = [
      vm.basicToStopUserDataForLineChart,
      vm.standardToStopUserDataForLineChart,
      vm.premiumToStopUserDataForLineChart
    ];
    vm.lineChartDowngradeData = [
      vm.basicToRefundUserDataForLineChart,
      vm.standardToRefundUserDataForLineChart,
      vm.premiumToRefundUserDataForLineChart
    ];
    vm.lineChartCancelDataConfig = new LinechartUtils.LineChartConfig(vm.lineChartCancelData, null, true);
    vm.lineChartDowngradeDataConfig = new LinechartUtils.LineChartConfig(vm.lineChartDowngradeData, null, true);
    vm.lineChartFilter = lineChartFilter;
    vm.getPieChart = getPieChart;
    vm.selectDropdownRange = selectDropdownRange;
    vm.getDateColor = getDateColor;
    vm.getTableIndex = getTableIndex;
    vm.pageChanged = pageChanged;
    // Pie Chart
    vm.pieChartData = [{
        name: 'User Signups',
        y: 1
      }];
    vm.pieChartConfig = new PiechartUtils.PieChartConfig(vm.pieChartData);
    vm.pieChartFilter = pieChartFilter;
    vm.getPieChartProportion = getPieChartProportion;
    vm.fetchAndDownloadCSV = fetchAndDownloadCSV;
    init();
    function init() {
      lineChartFilter();  //getPieChart();
    }
    function getTableIndex(index) {
      return (vm.currentPage - 1) * vm.pageSize + index;
    }
    function lineChartFilter() {
      var count = 0;
      vm.lineChartDataLoop.forEach(function (dataContainer) {
        CancelUserData.getCancelData(dataContainer, vm.selectedRange, vm.selectedRoleFilter, vm.selectedDeviceFilter, vm.dateRange.startDate, vm.dateRange.endDate).then(function (result) {
          if (result.name === 'success') {
            count += 1;
            if (count === 6) {
              createEmptyData(vm.selectedRange);
            }
          }
        });
      });
    }
    function createEmptyData(selectedRange) {
      var range;
      var startDateCopy = new Date(vm.basicToStopUserDataForLineChart.data[0][0]);
      var flag = false;
      vm.reversedData = [];
      if (selectedRange === 'daily') {
        range = 1;
      } else if (selectedRange === 'weekly') {
        range = 7;
      } else if (selectedRange === 'monthly') {
        startDateCopy = new Date(vm.dateRange.startDate.getFullYear(), vm.dateRange.startDate.getMonth() + 1, 0, 23, 59, 59);
      } else {
        range = 365;
        startDateCopy = new Date(vm.dateRange.startDate.getFullYear(), 11, 31);
      }
      while (startDateCopy < vm.dateRange.endDate) {
        vm.reversedData.push([
          startDateCopy.setHours(12, 0, 0, 0),
          0,
          0,
          0,
          0,
          0,
          0
        ]);
        if (selectedRange === 'monthly') {
          startDateCopy = new Date(startDateCopy.getFullYear(), startDateCopy.getMonth() + 2, 0, 23, 59, 59);
        } else {
          startDateCopy = new Date(startDateCopy.getTime());
          startDateCopy.setDate(startDateCopy.getDate() + range);
        }
        if (startDateCopy > vm.dateRange.endDate) {
          flag = true;
        }
      }
      if (flag === true && (vm.reversedData[vm.reversedData.length - 1][0] !== vm.dateRange.endDate.setHours(12, 0, 0, 0) || vm.reversedData.length === 0)) {
        vm.reversedData.push([
          vm.dateRange.endDate.setHours(12, 0, 0, 0),
          0,
          0,
          0,
          0,
          0,
          0
        ]);
      }
      concatContainer();
    }
    function concatContainer() {
      for (var i = 0; i < vm.reversedData.length; i++) {
        for (var j = 0; j < vm.basicToStopUserDataForLineChart.data.length; j++) {
          if (vm.reversedData[i][0] === vm.basicToStopUserDataForLineChart.data[j][0]) {
            vm.reversedData[i][1] = vm.basicToStopUserDataForLineChart.data[j][1];
          }
        }
      }
      for (var i = 0; i < vm.reversedData.length; i++) {
        for (var j = 0; j < vm.standardToStopUserDataForLineChart.data.length; j++) {
          if (vm.reversedData[i][0] === vm.standardToStopUserDataForLineChart.data[j][0]) {
            vm.reversedData[i][2] = vm.standardToStopUserDataForLineChart.data[j][1];
          }
        }
      }
      for (var i = 0; i < vm.reversedData.length; i++) {
        for (var j = 0; j < vm.premiumToStopUserDataForLineChart.data.length; j++) {
          if (vm.reversedData[i][0] === vm.premiumToStopUserDataForLineChart.data[j][0]) {
            vm.reversedData[i][3] = vm.premiumToStopUserDataForLineChart.data[j][1];
          }
        }
      }
      for (var i = 0; i < vm.reversedData.length; i++) {
        for (var j = 0; j < vm.basicToRefundUserDataForLineChart.data.length; j++) {
          if (vm.reversedData[i][0] === vm.basicToRefundUserDataForLineChart.data[j][0]) {
            vm.reversedData[i][4] = vm.basicToRefundUserDataForLineChart.data[j][1];
          }
        }
      }
      for (var i = 0; i < vm.reversedData.length; i++) {
        for (var j = 0; j < vm.premiumToRefundUserDataForLineChart.data.length; j++) {
          if (vm.reversedData[i][0] === vm.premiumToRefundUserDataForLineChart.data[j][0]) {
            vm.reversedData[i][5] = vm.premiumToRefundUserDataForLineChart.data[j][1];
          }
        }
      }
      for (var i = 0; i < vm.reversedData.length; i++) {
        for (var j = 0; j < vm.standardToRefundUserDataForLineChart.data.length; j++) {
          if (vm.reversedData[i][0] === vm.standardToRefundUserDataForLineChart.data[j][0]) {
            vm.reversedData[i][6] = vm.standardToRefundUserDataForLineChart.data[j][1];
          }
        }
      }
      vm.reversedData.reverse();
      vm.totalItem = vm.reversedData.length - 1;
      pageChanged(1);
    }
    function pageChanged(currentPage) {
      vm.currentPage = currentPage;
      vm.reversedDataContainer = [];
      var start = (vm.currentPage - 1) * 20;
      for (var i = start; i < start + 20; i++) {
        if (vm.reversedData.length === 0) {
          break;
        }
        if (i === vm.totalItem) {
          vm.reversedDataContainer.push([
            vm.reversedData[i][0],
            vm.reversedData[i][1],
            '-',
            '-',
            vm.reversedData[i][2],
            '-',
            '-',
            vm.reversedData[i][3],
            '-',
            '-',
            vm.reversedData[i][4],
            '-',
            '-',
            vm.reversedData[i][5],
            '-',
            '-',
            vm.reversedData[i][6],
            '-',
            '-'
          ]);
          break;
        } else {
          vm.reversedDataContainer.push([
            vm.reversedData[i][0],
            vm.reversedData[i][1],
            vm.reversedData[i][1] - vm.reversedData[i + 1][1],
            (vm.reversedData[i][1] - vm.reversedData[i + 1][1]) / (vm.reversedData[i + 1][1] || 1),
            vm.reversedData[i][2],
            vm.reversedData[i][2] - vm.reversedData[i + 1][2],
            (vm.reversedData[i][2] - vm.reversedData[i + 1][2]) / (vm.reversedData[i + 1][2] || 1),
            vm.reversedData[i][3],
            vm.reversedData[i][3] - vm.reversedData[i + 1][3],
            (vm.reversedData[i][3] - vm.reversedData[i + 1][3]) / (vm.reversedData[i + 1][3] || 1),
            vm.reversedData[i][4],
            vm.reversedData[i][4] - vm.reversedData[i + 1][4],
            (vm.reversedData[i][4] - vm.reversedData[i + 1][4]) / (vm.reversedData[i + 1][4] || 1),
            vm.reversedData[i][5],
            vm.reversedData[i][5] - vm.reversedData[i + 1][5],
            (vm.reversedData[i][5] - vm.reversedData[i + 1][5]) / (vm.reversedData[i + 1][5] || 1),
            vm.reversedData[i][6],
            vm.reversedData[i][6] - vm.reversedData[i + 1][6],
            (vm.reversedData[i][6] - vm.reversedData[i + 1][6]) / (vm.reversedData[i + 1][6] || 1)
          ]);
        }
      }
    }
    function selectDropdownRange(range) {
      vm.selectedRange = range;
      lineChartFilter();
    }
    function getPieChart() {
      CancelUserData.getNewPaidProportionData(vm.pieChartData, vm.selectedPieChartFilter, vm.dateRangePieChart.startDate, vm.dateRangePieChart.endDate, vm.currentPieChartUsers, vm.availableTypes[0]);
    }
    function pieChartFilter(selectedFilter) {
      vm.selectedPieChartFilter = selectedFilter;
      getPieChart();
    }
    function getPieChartTotal() {
      var total = 0;
      vm.pieChartSumData.forEach(function (data) {
        total += data.y;
      });
      return total;
    }
    function getPieChartProportion(data) {
      return data / getPieChartTotal();
    }
    function fetchAndDownloadCSV(dataContainer, type) {
      var copyContainer = [];
      var fields;
      if (type === 'LineChart') {
        fields = [
          'date',
          'basic to unsubscribe',
          'standard to unsubscribe',
          'premium to unsubscribe',
          'basic to refund',
          'standard to refund',
          'premium to refund'
        ];
        dataContainer.forEach(function (item, i) {
          var tmp = [];
          tmp[0] = item[0];
          tmp[1] = item[1];
          tmp[2] = item[2];
          tmp[3] = item[3];
          tmp[4] = item[4];
          tmp[5] = item[5];
          tmp[6] = item[6];
          copyContainer.push(tmp);
        });
        CSVparserUtils.downloadCSV2(copyContainer, false, 'cancel_userdata_' + vm.selectedRange + '.csv', fields);  // PieChart
      } else {
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
        CSVparserUtils.downloadCSV2(copyContainer, false, 'cumulative_userdata_' + vm.selectedPieChartFilter + '_count_proportion' + '.csv', fields);
      }
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
  CancelUserDataController.$inject = [
    'CancelUserData',
    'LinechartUtils',
    'PiechartUtils',
    'APP_CONFIG',
    '$filter',
    'CSVparserUtils'
  ];
  angular.module('dataDashboard.cancelUserData.controller.CancelUserDataController', []).controller('CancelUserDataController', CancelUserDataController);
}());