(function () {
  'use strict';
  function AndroidCountryStatsController(MobileStoreStats, LinechartUtils, CSVparserUtils, CommonUtils, APP_CONFIG, $scope) {
    var vm = this, series, target, columns = [
        4,
        5,
        6
      ], dummyTime = new Date().getTime(), aliases = {
        'Daily Device Installs': '#daily-device-installs',
        'Daily Device Uninstalls': '#daily-device-uninstalls',
        'Daily Device Upgrades': '#daily-device-upgrades'
      };
    vm.dataSubjects = Object.keys(aliases);
    vm.getAverage = LinechartUtils.getAverage;
    vm.getMinimum = LinechartUtils.getMinimum;
    vm.getMaximum = LinechartUtils.getMaximum;
    vm.getSum = LinechartUtils.getSum;
    vm.selectedCountry = 'KR';
    vm.availableCountries;
    vm.selectDropdownCountry = selectDropdownCountry;
    vm.dailyDeviceInstalls = {
      name: 'Daily Device Installs',
      data: [[
          dummyTime,
          0
        ]],
      id: 'dailyDeviceInstalls',
      color: APP_CONFIG.COLORS[0]
    };
    vm.dailyDeviceUninstalls = {
      name: 'Daily Device Uninstalls',
      data: [[
          dummyTime,
          0
        ]],
      id: 'dailyDeviceUninstalls',
      color: APP_CONFIG.COLORS[1]
    };
    vm.dailyDeviceUpgrades = {
      name: 'Daily Device Upgrades',
      data: [[
          dummyTime,
          0
        ]],
      id: 'dailyDeviceUpgrades',
      color: APP_CONFIG.COLORS[2]
    };
    vm.lineChartData = [
      vm.dailyDeviceInstalls,
      vm.dailyDeviceUninstalls,
      vm.dailyDeviceUpgrades
    ];
    vm.tableData = {};
    vm.csvSource = $scope.$parent.mobileStoreStatsVm.csvData;
    vm.lineChartConfig = new LinechartUtils.LineChartConfigForCSV(vm.lineChartData, true);
    vm.updateData = updateData;
    vm.predicate = 'Daily Device Installs';
    vm.convertObjectToArray = CommonUtils.convertObjectToArray;
    function updateData() {
      vm.tableData = {};
      CSVparserUtils.convertParsedCSVDataToOverviewTable(vm.tableData, vm.csvSource.androidCountryStats, columns);
      CSVparserUtils.convertParsedCSVDataToItemSpecificSeries(vm.lineChartData, vm.csvSource.androidCountryStats, columns, vm.selectedCountry);
      vm.availableCountries = Object.keys(vm.tableData);
    }
    function toggleSeries($event) {
      if (!vm.linechart) {
        vm.linechart = vm.lineChartConfig.getHighcharts();
      }
      target = $($event.currentTarget);
      series = vm.linechart.get(target.attr('name'));
      if (series.visible) {
        series.hide();
        target.children().removeClass('active');
      } else {
        series.show();
        target.children().addClass('active');
      }
    }
    function selectDropdownCountry(country) {
      vm.selectedCountry = country;
      CSVparserUtils.convertParsedCSVDataToItemSpecificSeries(vm.lineChartData, vm.csvSource.androidCountryStats, columns, country);
    }
  }
  AndroidCountryStatsController.$inject = [
    'MobileStoreStats',
    'LinechartUtils',
    'CSVparserUtils',
    'CommonUtils',
    'APP_CONFIG',
    '$scope'
  ];
  angular.module('dataDashboard.mobileStoreStats.controller.AndroidCountryStatsController', []).controller('AndroidCountryStatsController', AndroidCountryStatsController);
}());