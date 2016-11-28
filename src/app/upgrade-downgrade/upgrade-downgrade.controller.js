(function () {
  'use strict';
  var today = new Date();
  var defaultStartDate = new Date(new Date(today).setMonth(today.getMonth() - 1));
  function UpgradeDowngradeController(UpgradeDowngrade, LinechartUtils, PiechartUtils, APP_CONFIG, $filter, CSVparserUtils, $q) {
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
    vm.selectedPieChartFilter = 'type';
    vm.selectedRange = 'daily';
    vm.selectedRoleFilter = 'all';
    vm.selectedDeviceFilter = 'all';
    vm.selectedPaidFilter = 'all';
    // Upgrade Paid Line Chart
    vm.basicToStandardDataForLineChart = {
      name: 'Basic to Standard',
      data: [[
          new Date().getTime(),
          0
        ]],
      id: 'basic-standard',
      color: APP_CONFIG.COLORS[0]
    };
    vm.basicToPremiumDataForLineChart = {
      name: 'Basic to Premium',
      data: [[
          new Date().getTime(),
          0
        ]],
      id: 'basic-premium',
      color: APP_CONFIG.COLORS[1]
    };
    vm.standardToPremiumDataForLineChart = {
      name: 'Standard to Premium',
      data: [[
          new Date().getTime(),
          0
        ]],
      id: 'standard-premium',
      color: APP_CONFIG.COLORS[2]
    };
    // Downgrade Paid Line Chart
    vm.standardToBasicDataForLineChart = {
      name: 'Standard to basic',
      data: [[
          new Date().getTime(),
          0
        ]],
      id: 'standard-basic',
      color: APP_CONFIG.COLORS[0]
    };
    vm.premiumdToStandardDataForLineChart = {
      name: 'Premium to Standard',
      data: [[
          new Date().getTime(),
          0
        ]],
      id: 'premium-standard',
      color: APP_CONFIG.COLORS[2]
    };
    vm.premiumdToBasicDataForLineChart = {
      name: 'Premium To Basic',
      data: [[
          new Date().getTime(),
          0
        ]],
      id: 'premium-basic',
      color: APP_CONFIG.COLORS[1]
    };
    vm.lineChartDataLoop = [
        vm.basicToStandardDataForLineChart,
        vm.basicToPremiumDataForLineChart,
        vm.standardToPremiumDataForLineChart,
        vm.standardToBasicDataForLineChart,
        vm.premiumdToStandardDataForLineChart,
        vm.premiumdToBasicDataForLineChart
    ];
    vm.reversedData = [];
    vm.reversedDataContainer = [];
    vm.lineChartUpgradeData = [
      vm.basicToStandardDataForLineChart,
      vm.basicToPremiumDataForLineChart,
      vm.standardToPremiumDataForLineChart,
    ];
    vm.lineChartDowngradeData = [
      vm.standardToBasicDataForLineChart,
      vm.premiumdToStandardDataForLineChart,
      vm.premiumdToBasicDataForLineChart
    ];
    vm.lineChartUpgradeDataConfig = new LinechartUtils.LineChartConfig(vm.lineChartUpgradeData, null, true);
    vm.lineChartDowngradeDataConfig = new LinechartUtils.LineChartConfig(vm.lineChartDowngradeData, null, true);
    vm.lineChartFilter = lineChartFilter;
    vm.selectDropdownRange = selectDropdownRange;
    vm.getDateColor = getDateColor;
    vm.getTableIndex = getTableIndex;
    vm.pageChanged = pageChanged;
    vm.fetchAndDownloadCSV = fetchAndDownloadCSV;
    init();
    function init() {
      lineChartFilter();
      createEmptyData();
    }
    function getTableIndex(index) {
      return (vm.currentPage - 1) * vm.pageSize + index;
    }
    function lineChartFilter() {
      var count = 0;
      vm.lineChartDataLoop.forEach(function (dataContainer) {
        UpgradeDowngrade.getUpgradeDowngradeData(dataContainer, vm.selectedRange, vm.selectedRoleFilter, vm.selectedDeviceFilter, vm.dateRange.startDate, vm.dateRange.endDate).then(function (result) {
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
      var startDateCopy;
      if (vm.basicToStandardDataForLineChart.data.length === 0) {
        startDateCopy = new Date();
      } else {
        startDateCopy = new Date(vm.basicToStandardDataForLineChart.data[0][0]);
      }
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
      if (flag === true && (vm.reversedData[vm.reversedData.length - 1][0] !== vm.dateRange.endDate.setHours(12, 0, 0, 0) || vm.reversedData.length === 0) || selectedRange === 'yearly') {
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
        for (var j = 0; j < vm.basicToStandardDataForLineChart.data.length; j++) {
          if (vm.reversedData[i][0] === vm.basicToStandardDataForLineChart.data[j][0]) {
            vm.reversedData[i][1] = vm.basicToStandardDataForLineChart.data[j][1];
          }
        }
      }
      for (var i = 0; i < vm.reversedData.length; i++) {
        for (var j = 0; j < vm.basicToPremiumDataForLineChart.data.length; j++) {
          if (vm.reversedData[i][0] === vm.basicToPremiumDataForLineChart.data[j][0]) {
            vm.reversedData[i][2] = vm.basicToPremiumDataForLineChart.data[j][1];
          }
        }
      }
      for (var i = 0; i < vm.reversedData.length; i++) {
        for (var j = 0; j < vm.standardToPremiumDataForLineChart.data.length; j++) {
          if (vm.reversedData[i][0] === vm.standardToPremiumDataForLineChart.data[j][0]) {
            vm.reversedData[i][3] = vm.standardToPremiumDataForLineChart.data[j][1];
          }
        }
      }
      for (var i = 0; i < vm.reversedData.length; i++) {
        for (var j = 0; j < vm.standardToBasicDataForLineChart.data.length; j++) {
          if (vm.reversedData[i][0] === vm.standardToBasicDataForLineChart.data[j][0]) {
            vm.reversedData[i][4] = vm.standardToBasicDataForLineChart.data[j][1];
          }
        }
      }
      for (var i = 0; i < vm.reversedData.length; i++) {
        for (var j = 0; j < vm.premiumdToStandardDataForLineChart.data.length; j++) {
          if (vm.reversedData[i][0] === vm.premiumdToStandardDataForLineChart.data[j][0]) {
            vm.reversedData[i][5] = vm.premiumdToStandardDataForLineChart.data[j][1];
          }
        }
      }
      for (var i = 0; i < vm.reversedData.length; i++) {
        for (var j = 0; j < vm.premiumdToBasicDataForLineChart.data.length; j++) {
          if (vm.reversedData[i][0] === vm.premiumdToBasicDataForLineChart.data[j][0]) {
            vm.reversedData[i][6] = vm.premiumdToBasicDataForLineChart.data[j][1];
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
    function fetchAndDownloadCSV(dataContainer, type) {
      var copyContainer = [];
      var fields;
      if (type === 'LineChart') {
        fields = [
          'date',
          'trial to basic',
          'trial to standard',
          'trial to premium',
          'basic subscribers',
          'standard subscribers',
          'premium subscribers'
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
        CSVparserUtils.downloadCSV2(copyContainer, false, 'upgrade_downgrade_' + vm.selectedRange + '.csv', fields);  // PieChart
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
  UpgradeDowngradeController.$inject = [
    'UpgradeDowngrade',
    'LinechartUtils',
    'PiechartUtils',
    'APP_CONFIG',
    '$filter',
    'CSVparserUtils',
    '$q'
  ];
  angular.module('dataDashboard.upgradeDowngrade.controller.UpgradeDowngradeController', []).controller('UpgradeDowngradeController', UpgradeDowngradeController);
}());