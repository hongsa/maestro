(function () {
  'use strict';
  function RateModalController(baseData, RateModalFactory) {
    var vm = this;
    vm.currentPage = 1;
    vm.pageSize = 20;
    vm.totalItem = 0;
    vm.dataContainer = [];
    vm.pageDataContainter = [];
    vm.pageChanged = pageChanged;
    vm.getDateColor = getDateColor;
    init();
    function init() {
      vm.baseData = baseData;
      getRateData();
    }
    function getRateData() {
      RateModalFactory.getRateData(vm.dataContainer, vm.baseData).then(function (result) {
        vm.totalItem = vm.dataContainer.length;
        vm.dataContainer.reverse();
        pageChanged(1);
      });
    }
    function pageChanged(currentPage) {
      vm.currentPage = currentPage;
      vm.pageDataContainter = [];
      var start = (vm.currentPage - 1) * vm.pageSize;
      for (var i = start; i < start + vm.pageSize; i++) {
        if (vm.dataContainer.length === 0) {
          break;
        }
        if (i === vm.totalItem) {
          break;
        }
        vm.pageDataContainter.push([
          vm.dataContainer[i][0],
          vm.dataContainer[i][1],
          vm.dataContainer[i][2]
        ]);
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
  }
  RateModalController.$inject = [
    'baseData',
    'RateModalFactory'
  ];
  angular.module('dataDashboard.cardRate.controller.RateModalController', []).controller('RateModalController', RateModalController);
}());