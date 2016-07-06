(function() {
  'use strict';

  function AndroidLanguageStatsController(MobileStoreStats, LinechartUtils, CSVparserUtils, CommonUtils, APP_CONFIG, $scope) {
    var vm = this,
        series,
        target,
        columns = [4,5,6],
        dummyTime = new Date().getTime(),
        aliases = {
          'Daily Device Installs': '#daily-device-installs',
          'Daily Device Uninstalls': '#daily-device-uninstalls',
          'Daily Device Upgrades': '#daily-device-upgrades'
        };

    vm.dataSubjects = Object.keys(aliases);
    vm.getAverage = LinechartUtils.getAverage;
    vm.getMinimum = LinechartUtils.getMinimum;
    vm.getMaximum = LinechartUtils.getMaximum;
    vm.getSum = LinechartUtils.getSum;

    vm.selectedLanguage = 'ko_KR';
    vm.availableLanguages;
    vm.selectDropdownLanguage = selectDropdownLanguage;

    vm.dailyDeviceInstalls = {
      name: 'Daily Device Installs',
      data: [[dummyTime, 0]],
      id: 'dailyDeviceInstalls',
      color: APP_CONFIG.COLORS[11]
    };
    vm.dailyDeviceUninstalls = {
      name: 'Daily Device Uninstalls',
      data: [[dummyTime, 0]],
      id: 'dailyDeviceUninstalls',
      color: APP_CONFIG.COLORS[12]
    };
    vm.dailyDeviceUpgrades = {
      name: 'Daily Device Upgrades',
      data: [[dummyTime, 0]],
      id: 'dailyDeviceUpgrades',
      color: APP_CONFIG.COLORS[13],
      visible: false
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
      CSVparserUtils.convertParsedCSVDataToOverviewTable(vm.tableData, vm.csvSource.androidLanguageStats, columns);
      CSVparserUtils.convertParsedCSVDataToItemSpecificSeries(vm.lineChartData, vm.csvSource.androidLanguageStats, columns, vm.selectedLanguage);
      vm.availableLanguages = Object.keys(vm.tableData);
    }

    function selectDropdownLanguage(language) {
      vm.selectedLanguage = language;
      CSVparserUtils.convertParsedCSVDataToItemSpecificSeries(vm.lineChartData, vm.csvSource.androidLanguageStats, columns, language);
    }
  }

  AndroidLanguageStatsController.$inject = ['MobileStoreStats', 'LinechartUtils', 'CSVparserUtils', 'CommonUtils', 'APP_CONFIG', '$scope'];

  angular.module('dataDashboard.mobileStoreStats.controller.AndroidLanguageStatsController', [])
    .controller('AndroidLanguageStatsController', AndroidLanguageStatsController);
})();