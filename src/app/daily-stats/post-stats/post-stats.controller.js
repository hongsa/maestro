(function() {
  'use strict';

  function PostStatsController(DailyStats, LinechartUtils, CSVparserUtils, APP_CONFIG) {
    var vm = this,
        aliases = {
          'new posts': '#new-posts'
        };

    vm.getAverage = LinechartUtils.getAverage;
    vm.getMinimum = LinechartUtils.getMinimum;
    vm.getMaximum = LinechartUtils.getMaximum;
    vm.getSum = LinechartUtils.getSum;

    vm.selectedRoleFilter = 'All';
    vm.selectedDeviceFilter = 'All';
    vm.selectedCountryFilter = 'All';
    vm.currentFilter = {
      role: 'All',
      device: 'All',
      country: 'All'
    };

    vm.availableRoles = ['All', 'teacher', 'student', 'parent'];
    vm.availableDevices = ['All', 'Android', 'iOS', 'Web']
    vm.availableCountries = ['All', 'Korea', 'Japan', 'Taiwan', 'USA', 'Canada'];

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

    vm.newPosts = {
      name: 'new posts',
      data: [[DailyStats.dateRange.endDate.getTime(), 0]],
      id: 'newPosts',
      color: APP_CONFIG.COLORS[4]
    };

    vm.lineChartData = [
      vm.newPosts
    ];

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
      DailyStats.getDailyStatsData(vm.newPosts,
                                   'newPosts',
                                   DailyStats.dateRange.startDate,
                                   DailyStats.dateRange.endDate,
                                   vm.selectedDeviceFilter,
                                   vm.selectedRoleFilter,
                                   vm.selectedCountryFilter,
                                   vm.linechart);
      vm.currentFilter.role = vm.selectedRoleFilter;
      vm.currentFilter.device = vm.selectedDeviceFilter;
      vm.currentFilter.country = vm.selectedCountryFilter;
    }

    function fetchAndDownloadCSV() {
      CSVparserUtils.downloadCSV(vm.newPosts,
                                 false,
                                 'daily_new_posts_' +
                                 DailyStats.dateRange.startDate.toLocaleDateString().replace(/[\.\ ]/g, '') + '-' +
                                 DailyStats.dateRange.endDate.toLocaleDateString().replace(/[\.\ ]/g, '') + 
                                 '_by_device-' + vm.currentFilter.device +
                                 '_role-' + vm.currentFilter.role +
                                 '_country-' + vm.currentFilter.country + '.csv');
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

  PostStatsController.$inject = ['DailyStats', 'LinechartUtils', 'CSVparserUtils', 'APP_CONFIG'];

  angular.module('dataDashboard.dailyStats.controller.PostStatsController', [])
    .controller('PostStatsController', PostStatsController);
})();