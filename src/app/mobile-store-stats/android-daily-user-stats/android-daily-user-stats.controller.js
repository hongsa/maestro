(function () {
  'use strict';
  function AndroidDailyUserStatsController(MobileStoreStats, LinechartUtils, CSVparserUtils, APP_CONFIG, $scope) {
    var vm = this, series, target, columns = [
        8,
        9
      ], dummyTime = new Date().getTime(), aliases = {
        'Daily User Installs': '#daily-user-installs',
        'Daily User Uninstalls': '#daily-user-uninstalls'
      };
    vm.dataSubjects = Object.keys(aliases);
    vm.getAverage = LinechartUtils.getAverage;
    vm.getMinimum = LinechartUtils.getMinimum;
    vm.getMaximum = LinechartUtils.getMaximum;
    vm.getSum = LinechartUtils.getSum;
    vm.dailyUserInstalls = {
      name: 'Daily User Installs',
      data: [[
          dummyTime,
          0
        ]],
      id: 'dailyUserInstalls',
      color: APP_CONFIG.COLORS[9]
    };
    vm.dailyUserUninstalls = {
      name: 'Daily User Uninstalls',
      data: [[
          dummyTime,
          0
        ]],
      id: 'dailyUserUninstalls',
      color: APP_CONFIG.COLORS[10]
    };
    vm.lineChartData = [
      vm.dailyUserInstalls,
      vm.dailyUserUninstalls
    ];
    vm.csvSource = $scope.$parent.mobileStoreStatsVm.csvData;
    vm.lineChartConfig = new LinechartUtils.LineChartConfigForCSV(vm.lineChartData, true);
    vm.updateData = updateData;
    function updateData() {
      CSVparserUtils.convertParsedCSVDataToHighchartsSeries(vm.lineChartData, vm.csvSource.androidInstallsOverview, columns);
    }
  }
  AndroidDailyUserStatsController.$inject = [
    'MobileStoreStats',
    'LinechartUtils',
    'CSVparserUtils',
    'APP_CONFIG',
    '$scope'
  ];
  angular.module('dataDashboard.mobileStoreStats.controller.AndroidDailyUserStatsController', []).controller('AndroidDailyUserStatsController', AndroidDailyUserStatsController);
}());