(function() {
  'use strict';

  function ClassesSchoolsStatsController(DailyStats, LinechartUtils, CSVparserUtils, APP_CONFIG) {
    var vm = this,
        aliases = {
          'new classes': '#new-classes',
          'deleted classes': '#deleted-classes'
        };

    vm.getAverage = LinechartUtils.getAverage;
    vm.getMinimum = LinechartUtils.getMinimum;
    vm.getMaximum = LinechartUtils.getMaximum;
    vm.getSum = LinechartUtils.getSum;

    vm.selectedRoleFilter = 'teacher';
    vm.selectedDeviceFilter = 'All';
    vm.selectedCountryFilter = 'All';
    vm.currentFilter = {
      device: 'All',
      country: 'All'
    };

    vm.availableDevices = ['All', 'Android', 'iOS', 'Web']
    vm.availableCountries = ['All', 'Korea', 'Japan', 'Taiwan', 'USA', 'Canada'];
    vm.availableDownloadOptions = [
      'New Classes',
      'Deleted Classes'
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

    vm.newClasses = {
      name: 'new classes',
      data: [[DailyStats.dateRange.endDate.getTime(), 0]],
      id: 'newClasses',
      color: APP_CONFIG.COLORS[0]
    };
    vm.deletedClasses = {
      name: 'deleted classes',
      data: [[DailyStats.dateRange.endDate.getTime(), 0]],
      id: 'deletedClasses',
      color: APP_CONFIG.COLORS[1]
    };

    vm.lineChartData = [
      vm.newClasses,
      vm.deletedClasses
    ];

    vm.lineChartConfig = new LinechartUtils.LineChartConfig(vm.lineChartData, null, true);
    vm.linechart;

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
      DailyStats.getDailyStatsData(vm.newClasses,
                                   'newClasses',
                                   DailyStats.dateRange.startDate,
                                   DailyStats.dateRange.endDate,
                                   vm.selectedDeviceFilter,
                                   vm.selectedRoleFilter,
                                   vm.selectedCountryFilter,
                                   vm.linechart);
      DailyStats.getDailyStatsData(vm.deletedClasses,
                                   'deletedClasses',
                                   DailyStats.dateRange.startDate,
                                   DailyStats.dateRange.endDate,
                                   vm.selectedDeviceFilter,
                                   vm.selectedRoleFilter,
                                   vm.selectedCountryFilter,
                                   vm.linechart);
      vm.currentFilter.device = vm.selectedDeviceFilter;
      vm.currentFilter.country = vm.selectedCountryFilter;
    }

    function fetchAndDownloadCSV(selectedSubject) {
      if (selectedSubject === 'New Classes') {
        CSVparserUtils.downloadCSV(vm.newClasses,
                                   false,
                                   'daily_new_classes_' +
                                   DailyStats.dateRange.startDate.toLocaleDateString().replace(/[\.\ ]/g, '') + '-' +
                                   DailyStats.dateRange.endDate.toLocaleDateString().replace(/[\.\ ]/g, '') + 
                                   '_by_device-' + vm.currentFilter.device +
                                   '_country-' + vm.currentFilter.country + '.csv');
      } else if (selectedSubject === 'Deleted Classes') {
        CSVparserUtils.downloadCSV(vm.deletedClasses,
                                   false,
                                   'daily_deleted_classes_' +
                                   DailyStats.dateRange.startDate.toLocaleDateString().replace(/[\.\ ]/g, '') + '-' +
                                   DailyStats.dateRange.endDate.toLocaleDateString().replace(/[\.\ ]/g, '') + 
                                   '_by_device-' + vm.currentFilter.device +
                                   '_country-' + vm.currentFilter.country + '.csv');
      }
    }

    function selectDropdownDevice(device) {
      vm.selectedDeviceFilter = device;
    }

    function selectDropdownCountry(country) {
      vm.selectedCountryFilter = country;
    }
  }

  ClassesSchoolsStatsController.$inject = ['DailyStats', 'LinechartUtils', 'CSVparserUtils', 'APP_CONFIG'];

  angular.module('dataDashboard.dailyStats.controller.ClassesSchoolsStatsController', [])
    .controller('ClassesSchoolsStatsController', ClassesSchoolsStatsController);
})();