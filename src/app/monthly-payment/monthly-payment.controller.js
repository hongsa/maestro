(function () {
  'use strict';
  var today = new Date();
  var defaultStartDate = new Date(new Date(today).setMonth(today.getMonth() - 1));
  function MonthlyPaymentController(MonthlyPayment, lodash) {
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
    vm.selectedDetailData = [];
    vm.totalSales = 0;
    vm.getMontlyPaymentData = getMontlyPaymentData;
    vm.selectedData = selectedData;

    init();
    function init() {
      getDateList();
      getMontlyPaymentData();
    }

    function getMontlyPaymentData() {
      vm.totalContainer.splice(0);
      vm.selectedDetailData.splice(0);
      vm.totalSales = 0;
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
                console.log(vm.totalContainer)
              }
            });
          }
        });
      });
    }

    function selectedData(item) {
      vm.selectedDetailData.splice(0);
      vm.totalSales = 0;
      lodash.forEach(item, function(value, key) {
        if (key === 'date') {
          vm.selectedDetailData.push(value);
        }
        if (key === 'newUser' || key === 'continueUser' || key === 'stopUser' || key === 'refundUser') {
          var tmp = {};
          tmp.type = key;
          tmp.basic = 0;
          tmp.standard = 0;
          tmp.premium = 0;
          tmp.sales = 0;
          value.forEach(function(item) {
            if (item[1] === 'basic') {
              tmp.basic += 1;
              tmp.sales += checkDollar(item[2]);
            } else if (item[1] === 'standard') {
              tmp.standard += 1;
              tmp.sales += checkDollar(item[2]);
            } else if (item[1] === 'premium') {
              tmp.premium += 1;
              tmp.sales += checkDollar(item[2]);
            }
          });
          vm.selectedDetailData.push(tmp);
        }
      });
      getTotalRevenue();
    }

    function getTotalRevenue() {
      vm.selectedDetailData.forEach(function (row) {
        if (row.type === 'newUser' || row.type === 'continueUser') {
          vm.totalSales += row.sales;
        }
      });
    }

    function getDateList() {
      var todayMonth = new Date().getMonth() + 1;
      var startMonth = new Date(stringToDate(vm.criteriaDate)).getMonth() + 1;
      var start = new Date(stringToDate(vm.criteriaDate));

      while (startMonth <= todayMonth) {
        var tmp = new Date(start.getFullYear(), start.getMonth() + (todayMonth - startMonth), 15);
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
    function checkDollar(value) {
      if (value < 500) {
        return value * 1150;
      } else{
        return value;
      }
    }


  }
  MonthlyPaymentController.$inject = [
    'MonthlyPayment',
    'lodash'
  ];
  angular.module('dataDashboard.monthlyPayment.controller.MonthlyPaymentController', []).controller('MonthlyPaymentController', MonthlyPaymentController);
}());


//item.newUser.forEach(function (item) {
//  if (item[1] === 'basic') {
//    if (item[3] === 'app_store') {
//      vm.selectedDetailData.newUser.basic[0] +=1;
//    } else if (item[3] === 'iamport') {
//      vm.selectedDetailData.newUser.basic[1] +=1;
//    }
//  } else if (item[1] === 'standard') {
//    if (item[3] === 'app_store') {
//      vm.selectedDetailData.newUser.standard[0] +=1;
//    } else if (item[3] === 'iamport') {
//      vm.selectedDetailData.newUser.standard[1] +=1;
//    }
//  } else if (item[1] === 'premium'){
//    if (item[3] === 'app_store') {
//      vm.selectedDetailData.newUser.premium[0] +=1;
//    } else if (item[3] === 'iamport') {
//      vm.selectedDetailData.newUser.premium[1] +=1;
//    }
//  }
//});
//
//item.continueUser.forEach(function (item) {
//  if (item[1] === 'basic') {
//    if (item[3] === 'app_store') {
//      vm.selectedDetailData.continueUser.basic[0] +=1;
//    } else if (item[3] === 'iamport') {
//      vm.selectedDetailData.continueUser.basic[1] +=1;
//    }
//  } else if (item[1] === 'standard') {
//    if (item[3] === 'app_store') {
//      vm.selectedDetailData.continueUser.standard[0] +=1;
//    } else if (item[3] === 'iamport') {
//      vm.selectedDetailData.continueUser.standard[1] +=1;
//    }
//  } else if (item[1] === 'premium'){
//    if (item[3] === 'app_store') {
//      vm.selectedDetailData.continueUser.premium[0] +=1;
//    } else if (item[3] === 'iamport') {
//      vm.selectedDetailData.continueUser.premium[1] +=1;
//    }
//  }
//});
//
//item.stopUser.forEach(function (item) {
//  if (item[1] === 'basic') {
//    if (item[3] === 'app_store') {
//      vm.selectedDetailData.stop.basic[0] +=1;
//    } else if (item[3] === 'iamport') {
//      vm.selectedDetailData.stop.basic[1] +=1;
//    }
//  } else if (item[1] === 'standard') {
//    if (item[3] === 'app_store') {
//      vm.selectedDetailData.stop.standard[0] +=1;
//    } else if (item[3] === 'iamport') {
//      vm.selectedDetailData.stop.standard[1] +=1;
//    }
//  } else if (item[1] === 'premium'){
//    if (item[3] === 'app_store') {
//      vm.selectedDetailData.stop.premium[0] +=1;
//    } else if (item[3] === 'iamport') {
//      vm.selectedDetailData.stop.premium[1] +=1;
//    }
//  }
//});
//
//item.refundUser.forEach(function (item) {
//  if (item[1] === 'basic') {
//    if (item[3] === 'app_store') {
//      vm.selectedDetailData.refund.basic[0] +=1;
//    } else if (item[3] === 'iamport') {
//      vm.selectedDetailData.refund.basic[1] +=1;
//    }
//  } else if (item[1] === 'standard') {
//    if (item[3] === 'app_store') {
//      vm.selectedDetailData.refund.standard[0] +=1;
//    } else if (item[3] === 'iamport') {
//      vm.selectedDetailData.refund.standard[1] +=1;
//    }
//  } else if (item[1] === 'premium'){
//    if (item[3] === 'app_store') {
//      vm.selectedDetailData.refund.premium[0] +=1;
//    } else if (item[3] === 'iamport') {
//      vm.selectedDetailData.refund.premium[1] +=1;
//    }
//  }
//});
