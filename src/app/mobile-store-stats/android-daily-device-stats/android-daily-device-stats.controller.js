(function () {
  'use strict';
  function AndroidDailyDeviceStatsController(MobileStoreStats, LinechartUtils, CSVparserUtils, APP_CONFIG, $scope) {
    var vm = this;
    var series;
    var target;
    var dummyTime = new Date().getTime();
    var columns = [
      3,
      4,
      5
    ];
    var aliases = {
      'Daily Device Installs': '#daily-device-installs',
      'Daily Device Uninstalls': '#daily-device-uninstalls',
      'Daily Device Upgrades': '#daily-device-upgrades'
    };
    vm.dataSubjects = Object.keys(aliases);
    vm.getAverage = LinechartUtils.getAverage;
    vm.getMinimum = LinechartUtils.getMinimum;
    vm.getMaximum = LinechartUtils.getMaximum;
    vm.getSum = LinechartUtils.getSum;
    vm.dailyDeviceInstalls = {
      name: 'Daily Device Installs',
      data: [[
          dummyTime,
          0
        ]],
      id: 'dailyDeviceInstalls',
      color: APP_CONFIG.COLORS[6]
    };
    vm.dailyDeviceUninstalls = {
      name: 'Daily Device Uninstalls',
      data: [[
          dummyTime,
          0
        ]],
      id: 'dailyDeviceUninstalls',
      color: APP_CONFIG.COLORS[7]
    };
    vm.dailyDeviceUpgrades = {
      name: 'Daily Device Upgrades',
      data: [[
          dummyTime,
          0
        ]],
      id: 'dailyDeviceUpgrades',
      color: APP_CONFIG.COLORS[8],
      visible: false
    };
    vm.lineChartData = [
      vm.dailyDeviceInstalls,
      vm.dailyDeviceUninstalls,
      vm.dailyDeviceUpgrades
    ];
    vm.csvSource = $scope.$parent.mobileStoreStatsVm.csvData;
    vm.lineChartConfig = new LinechartUtils.LineChartConfigForCSV(vm.lineChartData, true);
    vm.updateData = updateData;
    function updateData() {
      CSVparserUtils.convertParsedCSVDataToHighchartsSeries(vm.lineChartData, vm.csvSource.androidInstallsOverview, columns);
    }
  }
  AndroidDailyDeviceStatsController.$inject = [
    'MobileStoreStats',
    'LinechartUtils',
    'CSVparserUtils',
    'APP_CONFIG',
    '$scope'
  ];
  angular.module('dataDashboard.mobileStoreStats.controller.AndroidDailyDeviceStatsController', []).controller('AndroidDailyDeviceStatsController', AndroidDailyDeviceStatsController);
}());