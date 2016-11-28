(function () {
  'use strict';
  var today = new Date();
  var defaultStartDate = new Date(new Date(today).setMonth(today.getMonth() - 1));
  function MonthlyPaymentController(MonthlyPayment, LinechartUtils, PiechartUtils, APP_CONFIG, $filter, CSVparserUtils, $q) {
    var vm = this;
    vm.currentPage = 1;
    vm.pageSize = 20;
    vm.totalItem = 0;
    vm.selectedDate = new Date();
    vm.dateList = [];
    vm.availableDevices = [
      'android',
      'ios'
    ];
    vm.selectedDeviceFilter = 'all';
    vm.criteriaDate = '2016-08-01';
    vm.startDate = '';
    vm.endDate = '';
    vm.newSubscribers = [];
    vm.continueSubscribers = [];
    vm.stopSubscribers = [];
    vm.refundSubscribers = [];
    vm.totalContainer = [];
    vm.getMontlyPaymentData = getMontlyPaymentData;

    init();
    function init() {
      getDateList();
      getMontlyPaymentData();
    }

    function getMontlyPaymentData() {
      vm.totalContainer.splice(0);
      vm.dateList.forEach(function (item) {
        var tmp = {};
        MonthlyPayment.getNewSubscribers(item, vm.selectedDeviceFilter).then(function (response) {
          if (response.status === 200) {
            tmp.date = response.date;
            tmp.newUser = response.newUser;
            tmp.stopUser = response.stopUser;
            tmp.refundUser = response.refundUser;
            MonthlyPayment.getContinueSubscribers(response.date, vm.selectedDeviceFilter).then(function (response) {
              if (response.status === 200) {
                tmp.continueUser = response.continueUser;
                vm.totalContainer.push(tmp);
                sortAsc();
              }
            });
          }
        });
      });
    }

    function getDateList() {
      var todayMonth = new Date().getMonth() + 1;
      var startMonth = new Date(stringToDate(vm.criteriaDate)).getMonth() + 1;
      var start = new Date(stringToDate(vm.criteriaDate));

      while (startMonth <= todayMonth) {
        var tmp = new Date(start.getFullYear(), start.getMonth() + (todayMonth - startMonth), 1);
        vm.dateList.push(tmp);
        startMonth += 1;
      }
    }

    function stringToDate(str) {
      var y = str.toString().substr(0,4),
          m = str.toString().substr(5,2) - 1,
          d = str.toString().substr(8,2),
          date = new Date(y,m,d).setHours(12, 0, 0, 0);
      return new Date(date).getTime();
    }
    function sortAsc() {
        vm.totalContainer.sort(function (a, b) {
          return a.date - b.date;
        });

    }


  }
  MonthlyPaymentController.$inject = [
    'MonthlyPayment',
    'LinechartUtils',
    'PiechartUtils',
    'APP_CONFIG',
    '$filter',
    'CSVparserUtils',
    '$q'
  ];
  angular.module('dataDashboard.monthlyPayment.controller.MonthlyPaymentController', []).controller('MonthlyPaymentController', MonthlyPaymentController);
}());