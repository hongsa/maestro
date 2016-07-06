(function() {
  'use strict';

  function AndroidCumulativeStatsController(MobileStoreStats, LinechartUtils, CSVparserUtils, APP_CONFIG, $scope) {
    var vm = this,
        series,
        target,
        dummyTime = new Date().getTime(),
        columns = [2,6,7],
        aliases = {
          'Current Device Installs': '#current-device-installs',
          'Current User Installs': '#current-user-installs',
          'Total User Installs': '#total-user-installs'
        };

    vm.dataSubjects = Object.keys(aliases);
    vm.getAverage = LinechartUtils.getAverage;
    vm.getMinimum = LinechartUtils.getMinimum;
    vm.getMaximum = LinechartUtils.getMaximum;
    vm.getSum = LinechartUtils.getSum;
    vm.selectedSubject = 'Current Device Installs';

    vm.currentDeviceInstalls = {
      name: 'Current Device Installs',
      data: [[dummyTime, 0]],
      id: 'currentDeviceInstalls',
      color: APP_CONFIG.COLORS[3]
    };
    vm.currentUserInstalls = {
      name: 'Current User Installs',
      data: [[dummyTime, 0]],
      id: 'currentUserInstalls',
      color: APP_CONFIG.COLORS[4],
      visible: false
    };
    vm.totalUserInstalls = {
      name: 'Total User Installs',
      data: [[dummyTime, 0]],
      id: 'totalUserInstalls',
      color: APP_CONFIG.COLORS[5],
      visible: false
    };

    vm.lineChartData = [
      vm.currentDeviceInstalls,
      vm.currentUserInstalls,
      vm.totalUserInstalls
    ];
    vm.reverseLineChartData;

    vm.csvSource = $scope.$parent.mobileStoreStatsVm.csvData;

    vm.lineChartConfig = new LinechartUtils.LineChartConfigForCSV(vm.lineChartData, true);

    vm.updateData = updateData;
    vm.selectDropdownSubject = selectDropdownSubject;
    vm.getSubjectIndex = getSubjectIndex;

    function updateData() {
      CSVparserUtils.convertParsedCSVDataToHighchartsSeries(vm.lineChartData, vm.csvSource.androidInstallsOverview, columns);
      setReversedContainer();
    }

    function getSubjectIndex() {
      return vm.dataSubjects.indexOf(vm.selectedSubject);
    }

    function selectDropdownSubject(subject) {
      vm.selectedSubject = subject;
    }

    function setReversedContainer() {
      vm.reverseLineChartData = angular.copy(vm.lineChartData);
      vm.reverseLineChartData[0].data.reverse();
      vm.reverseLineChartData[1].data.reverse();
      vm.reverseLineChartData[2].data.reverse();
    }
  }

  AndroidCumulativeStatsController.$inject = ['MobileStoreStats', 'LinechartUtils', 'CSVparserUtils', 'APP_CONFIG', '$scope'];

  angular.module('dataDashboard.mobileStoreStats.controller.AndroidCumulativeStatsController', [])
    .controller('AndroidCumulativeStatsController', AndroidCumulativeStatsController);
})();