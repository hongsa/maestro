(function () {
  'use strict';
  var today = new Date();
  var paginationSize = 20;
  var dailyActiveUserCompareIndex = 7;
  var defaultCompareIndex = 1;
  today.setHours(9);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);
  var lastMonth = new Date(today.getTime());
  var defaultStartDate = new Date('2015-11-07');
  var defaultEndDate = new Date('2015-11-30');
  lastMonth.setDate(lastMonth.getDate() - 29);
  function ActiveUsersController(ActiveUsers, LinechartUtils, CSVparserUtils, APP_CONFIG, $filter) {
    var vm = this;
    vm.currentPage = 1;
    vm.totalItem = 0;
    vm.dateRange = {
      startDate: lastMonth,
      endDate: today,
      dateArray: []
    };
    vm.availableRoles = [
      'child',
      'parent'
    ];
    vm.availableDevices = [
      'android',
      'ios'
    ];
    vm.availablePieChartFilters = [
      'roles',
      'devices'
    ];
    vm.selectedRoleFilter = 'all';
    vm.selectedDeviceFilter = 'all';
    vm.selectedActivenessCnt = 1;
    vm.selectedView = 'Daily Active Users';
    vm.availableViews = [
      'Daily Active Users',
      'Weekly Active Users',
      'Monthly Active Users'
    ];
    vm.reversedData = [];
    vm.reversedDataContainer = [];
    vm.getAverage = LinechartUtils.getAverage;
    vm.getMinimum = LinechartUtils.getMinimum;
    vm.getMaximum = LinechartUtils.getMaximum;
    // Line Chart
    vm.dailyActiveUsersDataForLineChart = {
      name: 'Daily Active Users',
      data: [[
          new Date().getTime(),
          0
        ]],
      id: 'daily-active-users'
    };
    vm.weeklyActiveUsersDataForLineChart = {
      name: 'Weekly Active Users',
      data: [[
          new Date().getTime(),
          0
        ]],
      id: 'weekly-active-users'
    };
    vm.monthlyActiveUsersDataForLineChart = {
      name: 'Monthly Active Users',
      data: [[
          new Date().getTime(),
          0
        ]],
      id: 'monthly-active-users'
    };
    vm.lineChartData = [
      vm.dailyActiveUsersDataForLineChart,
      vm.weeklyActiveUsersDataForLineChart,
      vm.monthlyActiveUsersDataForLineChart
    ];
    vm.lineChartConfig = new LinechartUtils.LineChartConfig(vm.lineChartData, null, true);
    vm.lineChartFilter = lineChartFilter;
    vm.pageChanged = pageChanged;
    vm.selectDropdownView = selectDropdownView;
    vm.getDateColor = getDateColor;
    vm.downloadCSV = downloadCSV;
    init();
    function init() {
      getOneWeekAgo(vm.dateRange.startDate);
      lineChartFilter();
    }
    function lineChartFilter() {
      updateDateArray();
      if (vm.selectedActivenessCnt && vm.selectedActivenessCnt > 0 && vm.selectedActivenessCnt <= 100) {
        ActiveUsers.getDailyActiveUsersData(vm.dailyActiveUsersDataForLineChart, vm.dateRange.startDate, vm.dateRange.endDate, vm.selectedDeviceFilter, vm.selectedRoleFilter, vm.selectedActivenessCnt, setReversedContainer);
        ActiveUsers.getWeeklyActiveUsersData(vm.weeklyActiveUsersDataForLineChart, vm.dateRange.startDate, vm.dateRange.endDate, vm.dateRange.dateArray, vm.selectedDeviceFilter, vm.selectedRoleFilter, vm.selectedActivenessCnt, setReversedContainer);
        ActiveUsers.getMonthlyActiveUsersData(vm.monthlyActiveUsersDataForLineChart, vm.dateRange.startDate, vm.dateRange.endDate, vm.dateRange.dateArray, vm.selectedDeviceFilter, vm.selectedRoleFilter, vm.selectedActivenessCnt, setReversedContainer);
      }
    }
    function updateDateArray() {
      var startDateCopy = new Date(vm.dateRange.startDate.getTime());
      vm.dateRange.dateArray.splice(0);
      while (startDateCopy < vm.dateRange.endDate) {
        vm.dateRange.dateArray.push(startDateCopy);
        startDateCopy = new Date(startDateCopy.getTime());
        startDateCopy.setDate(startDateCopy.getDate() + 1);
      }
      vm.dateRange.dateArray.push(vm.dateRange.endDate);
    }
    function downloadCSV(selectedSubject) {
      var fields = [
        'date',
        'count'
      ];
      var filename = ActiveUsers.getCsvFileName(selectedSubject, vm.dateRange.startDate, vm.dateRange.endDate);
      var copyContainer;
      fields.push('Role: ' + $filter('titleCase')(vm.selectedRoleFilter));
      fields.push('Device: ' + $filter('device')(vm.selectedDeviceFilter));
      fields.push('ActivenessCnt: ' + vm.selectedActivenessCnt);
      if (selectedSubject === 'Daily Active Users') {
        copyContainer = vm.dailyActiveUsersDataForLineChart.data.slice(0);
        CSVparserUtils.downloadCSV2(copyContainer, false, filename, fields);
      } else if (selectedSubject === 'Weekly Active Users') {
        copyContainer = vm.weeklyActiveUsersDataForLineChart.data.slice(0);
        CSVparserUtils.downloadCSV2(copyContainer, false, filename, fields);
      } else if (selectedSubject === 'Monthly Active Users') {
        copyContainer = vm.monthlyActiveUsersDataForLineChart.data.slice(0);
        CSVparserUtils.downloadCSV2(copyContainer, false, filename, fields);
      }
    }
    function setReversedContainer() {
      if (vm.selectedView === vm.availableViews[0]) {
        vm.reversedData = vm.dailyActiveUsersDataForLineChart;
      } else if (vm.selectedView === vm.availableViews[1]) {
        vm.reversedData = vm.weeklyActiveUsersDataForLineChart;
      } else {
        vm.reversedData = vm.monthlyActiveUsersDataForLineChart;
      }
      vm.reversedData = vm.reversedData.data.slice().reverse();
      vm.totalItem = vm.reversedData.length - 1;
      pageChanged(1);
    }
    function selectDropdownView(view) {
      vm.selectedView = view;
      setReversedContainer();
    }
    function pageChanged(currentPage) {
      vm.currentPage = currentPage;
      vm.reversedDataContainer = [];
      var start = (vm.currentPage - 1) * paginationSize;
      for (var i = start; i < start + paginationSize; i++) {
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
            (vm.reversedData[i][1] - vm.reversedData[i + 1][1]) / (vm.reversedData[i + 1][1] || 1)
          ]);
        }
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
    function getOneWeekAgo(date) {
      vm.dauStartDate = new Date(new Date(date).setDate(date.getDate() - 7));
    }
  }
  ActiveUsersController.$inject = [
    'ActiveUsers',
    'LinechartUtils',
    'CSVparserUtils',
    'APP_CONFIG',
    '$filter'
  ];
  angular.module('dataDashboard.activeUsers.controller.ActiveUsersController', []).controller('ActiveUsersController', ActiveUsersController);
}());