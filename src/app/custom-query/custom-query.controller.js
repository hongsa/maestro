(function () {
  'use strict';
  var today = new Date();
  var constraintDay = new Date(today.getTime());
  constraintDay.setDate(constraintDay.getDate() - 1);
  var twoDaysPast = new Date(constraintDay.getTime());
  twoDaysPast.setDate(twoDaysPast.getDate() - 2);
  function CustomQueryController(CustomQuery, LinechartUtils, APP_CONFIG) {
    var vm = this;
    var defaultData;
    var alertMsg;
    var dateOverConstraint = 'You can\'t select date after ' + constraintDay.getFullYear() + '. ' + (constraintDay.getMonth() + 1) + '. ' + constraintDay.getDate();
    var dateOverRange = 'Please select date within a month range';
    vm.dateRange = {
      startDate: twoDaysPast,
      endDate: constraintDay
    };
    vm.alertMsgContent;
    vm.constraintDay = constraintDay;
    vm.getAverage = LinechartUtils.getAverage;
    vm.getMinimum = LinechartUtils.getMinimum;
    vm.getMaximum = LinechartUtils.getMaximum;
    vm.getSum = LinechartUtils.getSum;
    vm.customQueryString = '';
    vm.selectedAPIFilter = 'posts';
    vm.selectedMethodFilter = 'POST';
    vm.selectedRoleFilter = 'All';
    vm.selectedDeviceFilter = 'All';
    vm.selectedTypeFilter = 'All';
    vm.selectedGroupByFilter = 'date';
    vm.selectedChartType = 'line';
    vm.availableAPIs = [
      'users',
      'classes',
      'posts',
      'sessions',
      'notices',
      'photos',
      'albums',
      'search'
    ];
    vm.availableMethods = [
      'GET',
      'POST',
      'PUT',
      'DELETE'
    ];
    vm.availableRoles = [
      'All',
      'child',
      'parent'
    ];
    vm.availableDevices = [
      'All',
      'Android',
      'iOS'
    ];
    vm.availableTypes = [
      'All',
      'api',
      'result',
      'quiz',
      'page',
      'event',
      'payment',
      'download'
    ];
    vm.availableGroupBys = [
      'date',
      'role',
      'device'
    ];
    vm.availableChartTypes = [
      'line',
      'area',
      'bar',
      'column',
      'pie',
      'scatter'
    ];
    vm.iconAliases = {
      'Android': 'fa-android',
      'iOS': 'fa-apple',
      'Web': 'fa-laptop',
      'Korea': 'flag-icon-kr',
      'Japan': 'flag-icon-jp',
      'Taiwan': 'flag-icon-tw',
      'USA': 'flag-icon-us',
      'Canada': 'flag-icon-ca'
    };
    vm.dataContainer = {
      name: 'custom query',
      data: [[
          vm.dateRange.endDate.getTime(),
          0
        ]],
      id: 'dataContainer',
      color: APP_CONFIG.COLORS[1]
    };
    vm.lineChartData = [vm.dataContainer];
    vm.lineChartConfig = new LinechartUtils.LineChartConfig(vm.lineChartData);
    vm.linechart;
    vm.selectDropdownMethod = selectDropdownMethod;
    vm.selectDropdownRole = selectDropdownRole;
    vm.selectDropdownDevice = selectDropdownDevice;
    vm.selectDropdownType = selectDropdownType;
    vm.selectDropdownAPI = selectDropdownAPI;
    vm.selectDropdownGroupBy = selectDropdownGroupBy;
    vm.selectDropdownChartType = selectDropdownChartType;
    vm.selectDateRange = selectDateRange;
    vm.triggerUpdateWithQueryString = triggerUpdateWithQueryString;
    vm.updateCustomQueryString = updateCustomQueryString;
    vm.updateData = updateData;
    init();
    function init() {
      updateCustomQueryString();
    }
    function selectDropdownChartType(type) {
      vm.selectedChartType = type;
      vm.lineChartConfig.options.chart.type = type;
    }
    function selectDropdownGroupBy(groupBy) {
      vm.selectedGroupByFilter = groupBy;
      updateCustomQueryString();
    }
    function selectDropdownAPI(api) {
      vm.selectedAPIFilter = api;
      updateCustomQueryString();
    }
    function selectDropdownMethod(method) {
      vm.selectedMethodFilter = method;
      updateCustomQueryString();
    }
    function selectDropdownRole(role) {
      vm.selectedRoleFilter = role;
      updateCustomQueryString();
    }
    function selectDropdownDevice(device) {
      vm.selectedDeviceFilter = device;
      updateCustomQueryString();
    }
    function selectDropdownType(type) {
      vm.selectedTypeFilter = type;
      console.log(vm.selectedTypeFilter)
      updateCustomQueryString();
    }
    function selectDateRange() {
      updateCustomQueryString();
    }
    function switchAxisType() {
      var groupByFilter = CustomQuery.getGroupByFilterFromQuery(vm.customQueryString);
      if (groupByFilter === null) {
        return null;
      } else if (groupByFilter.startsWith('date_histogram')) {
        vm.lineChartConfig.xAxis.type = 'datetime';
      } else {
        vm.lineChartConfig.xAxis.type = 'category';
      }
    }
    function updateCustomQueryString() {
      vm.customQueryString = CustomQuery.createQueryString(vm.selectedAPIFilter, vm.selectedDeviceFilter, vm.selectedRoleFilter, vm.selectedTypeFilter, vm.selectedMethodFilter, vm.selectedGroupByFilter, vm.dateRange.startDate, vm.dateRange.endDate);
    }
    function triggerUpdateWithQueryString() {
      if (!alertMsg) {
        alertMsg = angular.element('#date-alert-msg');
      }
      if (vm.customQueryString.substring(vm.customQueryString.toLowerCase().indexOf('from'), vm.customQueryString.toLowerCase().indexOf('where')).split(',').length > 30) {
        displayAlertMsg(dateOverRange);
      } else {
        alertMsg.addClass('hide');
        updateData();
      }
    }
    function updateData() {
      if (vm.lineChartConfig.getHighcharts) {
        vm.linechart = vm.lineChartConfig.getHighcharts();
        vm.linechart.showLoading();
      }
      console.log(vm.customQueryString)
      CustomQuery.getCustomQueryData(vm.dataContainer, vm.customQueryString, vm.dateRange.startDate, vm.dateRange.endDate, vm.linechart, displayAlertMsg, selectDropdownChartType, switchAxisType);
    }
    function displayAlertMsg(msg) {
      vm.alertMsgContent = msg;
      alertMsg.removeClass('hide');
    }
  }
  CustomQueryController.$inject = [
    'CustomQuery',
    'LinechartUtils',
    'APP_CONFIG'
  ];
  angular.module('dataDashboard.customQuery.controller.CustomQueryController', []).controller('CustomQueryController', CustomQueryController);
}());