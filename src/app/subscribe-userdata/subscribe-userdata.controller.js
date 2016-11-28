(function () {
  'use strict';
  var today = new Date();
  var defaultStartDate = new Date(new Date(today).setMonth(today.getMonth() - 1));
  function SubscribeUserDataController(SubscribeUserData, LinechartUtils, PiechartUtils, APP_CONFIG, $filter, CSVparserUtils, $q) {
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
      //'weekly',
      'monthly'
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
    // New Paid Line Chart
    vm.trialToBasicDataForLineChart = {
      name: 'Trial to Basic',
      data: [[
          new Date().getTime(),
          0
        ]],
      id: 'trial-basic',
      color: APP_CONFIG.COLORS[0]
    };
    vm.trialToStandardDataForLineChart = {
      name: 'Trial to Standard',
      data: [[
          new Date().getTime(),
          0
        ]],
      id: 'trial-standard',
      color: APP_CONFIG.COLORS[1]
    };
    vm.trialToPremiumDataForLineChart = {
      name: 'Trial to Premium',
      data: [[
          new Date().getTime(),
          0
        ]],
      id: 'trial-premium',
      color: APP_CONFIG.COLORS[2]
    };
    // Upgrade Paid Line Chart
    vm.basicSubscribersDataForLineChart = {
      name: 'Basic Subscribers',
      data: [[
          new Date().getTime(),
          0
        ]],
      id: 'basic-subscribers',
      color: APP_CONFIG.COLORS[0]
    };
    vm.standardSubscribersDataForLineChart = {
      name: 'Standard Subscribers',
      data: [[
          new Date().getTime(),
          0
        ]],
      id: 'standard-subscribers',
      color: APP_CONFIG.COLORS[2]
    };
    vm.premiumSubscribersDataForLineChart = {
      name: 'Premium Subscribers',
      data: [[
          new Date().getTime(),
          0
        ]],
      id: 'premium-subscribers',
      color: APP_CONFIG.COLORS[1]
    };
    vm.lineChartDataLoop = [
      vm.trialToBasicDataForLineChart,
      vm.trialToStandardDataForLineChart,
      vm.trialToPremiumDataForLineChart
    ];

    vm.reversedData = [];
    vm.reversedDataContainer = [];
    vm.lineChartPaidData = [
      vm.trialToBasicDataForLineChart,
      vm.trialToStandardDataForLineChart,
      vm.trialToPremiumDataForLineChart
    ];
    vm.lineChartUpgradeData = [
      vm.basicSubscribersDataForLineChart,
      vm.standardSubscribersDataForLineChart,
      vm.premiumSubscribersDataForLineChart
    ];
    vm.lineChartPaidDataConfig = new LinechartUtils.LineChartConfig(vm.lineChartPaidData, null, true);
    vm.lineChartUpgradeDataConfig = new LinechartUtils.LineChartConfig(vm.lineChartUpgradeData, null, true);
    vm.lineChartFilter = lineChartFilter;
    vm.selectDropdownRange = selectDropdownRange;
    vm.getDateColor = getDateColor;
    vm.getTableIndex = getTableIndex;
    vm.pageChanged = pageChanged;

    init();
    function init() {
      lineChartFilter();
    }
    function getTableIndex(index) {
      return (vm.currentPage - 1) * vm.pageSize + index;
    }
    function lineChartFilter() {
      var count = 0;
      vm.lineChartDataLoop.forEach(function (dataContainer) {
        SubscribeUserData.getSubscribeData(dataContainer, vm.selectedRange, vm.selectedRoleFilter, vm.selectedDeviceFilter, vm.dateRange.startDate, vm.dateRange.endDate).then(function (response) {
          if (response.status === 200) {
            count += 1;
            if (count === 3) {
              getContinueUser();
            }
          }
        });
      });
    }

    function getContinueUser() {
      SubscribeUserData.getNewUserList(vm.dateRange.endDate).then(function (response) {
        if (response.status === 200) {
          var newUserList = response.data;
          SubscribeUserData.getAndroidPayment(newUserList, vm.selectedRange, vm.dateRange.startDate, vm.dateRange.endDate).then(function (response) {
            if (response.status === 200) {
              var dateTmp = response.data;
              if (vm.selectedDeviceFilter === 'ios') {
                dateTmp = {};
                dateTmp.basic = {};
                dateTmp.standard = {};
                dateTmp.premium = {};
                SubscribeUserData.getIosPayment(newUserList, dateTmp, vm.basicSubscribersDataForLineChart, vm.standardSubscribersDataForLineChart, vm.premiumSubscribersDataForLineChart, vm.selectedRange, vm.dateRange.startDate, vm.dateRange.endDate).then(function (response) {
                  if (response.status === 200) {
                    createEmptyData(vm.selectedRange);
                  }
                });
              } else if (vm.selectedDeviceFilter === 'android') {
                vm.basicSubscribersDataForLineChart.data = getLineChartData(dateTmp.basic);
                vm.standardSubscribersDataForLineChart.data = getLineChartData(dateTmp.standard);
                vm.premiumSubscribersDataForLineChart.data = getLineChartData(dateTmp.premium);
                createEmptyData(vm.selectedRange);
              } else {
                SubscribeUserData.getIosPayment(newUserList, dateTmp, vm.basicSubscribersDataForLineChart, vm.standardSubscribersDataForLineChart, vm.premiumSubscribersDataForLineChart, vm.selectedRange, vm.dateRange.startDate, vm.dateRange.endDate).then(function (response) {
                  if (response.status === 200) {
                    createEmptyData(vm.selectedRange);
                  }
                });
              }
            }
          });
        }
      });
    }

    function getLineChartData(obj) {
      var container = [];
      for (var o in obj) {
        container.push([
          parseInt(o),
          obj[o]
        ]);
      }
      return sortDesc(container);
    }
    function sortDesc(datacontainer) {
      datacontainer.sort(function (a, b) {
        return b[0] - a[0];
      });
      return datacontainer;
    }

    function createEmptyData(selectedRange) {
      var range;
      var startDateCopy = new Date(vm.trialToBasicDataForLineChart.data[0][0]);
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
      while (startDateCopy <= vm.dateRange.endDate) {
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
        for (var j = 0; j < vm.trialToBasicDataForLineChart.data.length; j++) {
          if (vm.reversedData[i][0] === vm.trialToBasicDataForLineChart.data[j][0]) {
            vm.reversedData[i][1] = vm.trialToBasicDataForLineChart.data[j][1];
          }
        }
      }
      for (var i = 0; i < vm.reversedData.length; i++) {
        for (var j = 0; j < vm.trialToStandardDataForLineChart.data.length; j++) {
          if (vm.reversedData[i][0] === vm.trialToStandardDataForLineChart.data[j][0]) {
            vm.reversedData[i][2] = vm.trialToStandardDataForLineChart.data[j][1];
          }
        }
      }
      for (var i = 0; i < vm.reversedData.length; i++) {
        for (var j = 0; j < vm.trialToPremiumDataForLineChart.data.length; j++) {
          if (vm.reversedData[i][0] === vm.trialToPremiumDataForLineChart.data[j][0]) {
            vm.reversedData[i][3] = vm.trialToPremiumDataForLineChart.data[j][1];
          }
        }
      }
      for (var i = 0; i < vm.reversedData.length; i++) {
        for (var j = 0; j < vm.basicSubscribersDataForLineChart.data.length; j++) {
          if (vm.reversedData[i][0] === vm.basicSubscribersDataForLineChart.data[j][0]) {
            vm.reversedData[i][4] = vm.basicSubscribersDataForLineChart.data[j][1];
          }
        }
      }
      for (var i = 0; i < vm.reversedData.length; i++) {
        for (var j = 0; j < vm.standardSubscribersDataForLineChart.data.length; j++) {
          if (vm.reversedData[i][0] === vm.standardSubscribersDataForLineChart.data[j][0]) {
            vm.reversedData[i][5] = vm.standardSubscribersDataForLineChart.data[j][1];
          }
        }
      }
      for (var i = 0; i < vm.reversedData.length; i++) {
        for (var j = 0; j < vm.premiumSubscribersDataForLineChart.data.length; j++) {
          if (vm.reversedData[i][0] === vm.premiumSubscribersDataForLineChart.data[j][0]) {
            vm.reversedData[i][6] = vm.premiumSubscribersDataForLineChart.data[j][1];
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
  SubscribeUserDataController.$inject = [
    'SubscribeUserData',
    'LinechartUtils',
    'PiechartUtils',
    'APP_CONFIG',
    '$filter',
    'CSVparserUtils',
    '$q'
  ];
  angular.module('dataDashboard.subscribeUserData.controller.SubscribeUserDataController', []).controller('SubscribeUserDataController', SubscribeUserDataController);
}());