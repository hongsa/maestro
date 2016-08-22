(function () {
  'use strict';
  function VisitsStatsController(DailyStats, ActiveUsers, LinechartUtils, CSVparserUtils, APP_CONFIG) {
    var vm = this, aliases = { 'visits': '#visits' };
    vm.getAverage = LinechartUtils.getAverage;
    vm.getMinimum = LinechartUtils.getMinimum;
    vm.getMaximum = LinechartUtils.getMaximum;
    vm.getSum = LinechartUtils.getSum;
    vm.selectedRoleFilter = 'all';
    vm.selectedDeviceFilter = 'all';
    vm.selectedCountryFilter = 'all';
    vm.selectedActivenessCnt = 1;
    vm.currentFilter = {
      role: 'all',
      device: 'all',
      country: 'all'
    };
    vm.availableRoles = [
      'all',
      'student',
      'teacher',
      'parent'
    ];
    vm.availableDevices = [
      'all',
      'android',
      'ios',
      'web'
    ];
    vm.availableCountries = [
      'all',
      'kr',
      'jp',
      'us',
      'tw',
      'ca'
    ];
    vm.iconAliases = {
      'android': 'fa-android',
      'ios': 'fa-apple',
      'web': 'fa-laptop',
      'kr': 'flag-icon-kr',
      'jp': 'flag-icon-jp',
      'tw': 'flag-icon-tw',
      'us': 'flag-icon-us',
      'ca': 'flag-icon-ca'
    };
    vm.visits = {
      name: 'DAU',
      data: [],
      id: 'DAU',
      color: APP_CONFIG.COLORS[6]
    };
    vm.lineChartData = [vm.visits];
    vm.lineChartConfig = new LinechartUtils.LineChartConfig(vm.lineChartData);
    vm.linechart;
    vm.selectDropdownRole = selectDropdownRole;
    vm.selectDropdownDevice = selectDropdownDevice;
    vm.selectDropdownCountry = selectDropdownCountry;
    vm.updateData = updateData;
    vm.fetchAndDownloadCSV = fetchAndDownloadCSV;
    init();
    function init() {
      updateData();
    }
    function updateData() {
      if (vm.lineChartConfig.getHighcharts) {
        if (!vm.linechart) {
          vm.linechart = vm.lineChartConfig.getHighcharts();
        }
        vm.linechart.showLoading();
      }
      ActiveUsers.getDailyActiveUsersData(vm.visits, DailyStats.dateRange.startDate, DailyStats.dateRange.endDate, vm.selectedDeviceFilter, vm.selectedRoleFilter, vm.selectedCountryFilter, vm.selectedActivenessCnt, vm.linechart);
      vm.currentFilter.role = vm.selectedRoleFilter;
      vm.currentFilter.device = vm.selectedDeviceFilter;
      vm.currentFilter.country = vm.selectedCountryFilter;
    }
    function fetchAndDownloadCSV() {
      CSVparserUtils.downloadCSV(vm.visits, false, 'daily_visits_' + DailyStats.dateRange.startDate.toLocaleDateString().replace(/[\.\ ]/g, '') + '-' + DailyStats.dateRange.endDate.toLocaleDateString().replace(/[\.\ ]/g, '') + '_by_device-' + vm.currentFilter.device + '_role-' + vm.currentFilter.role + '_country-' + vm.currentFilter.country + '.csv');
    }
    function selectDropdownRole(role) {
      vm.selectedRoleFilter = role;
    }
    function selectDropdownDevice(device) {
      vm.selectedDeviceFilter = device;
    }
    function selectDropdownCountry(country) {
      vm.selectedCountryFilter = country;
    }
  }
  VisitsStatsController.$inject = [
    'DailyStats',
    'ActiveUsers',
    'LinechartUtils',
    'CSVparserUtils',
    'APP_CONFIG'
  ];
  angular.module('dataDashboard.dailyStats.controller.VisitsStatsController', []).controller('VisitsStatsController', VisitsStatsController);
}());