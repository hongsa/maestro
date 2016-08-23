(function () {
  'use strict';
  var iamport = {
    'basic1': 19800,
    'basic2': 35640,
    'basic3': 47520,
    'standard1': 29800,
    'standard2': 53640,
    'standard3': 71520,
    'premium1': 49800,
    'premium2': 89640,
    'premium3': 19520
  };
  var appStore = {
    'basic1': 22,
    'basic2': 40,
    'basic3': 53,
    'standard1': 33,
    'standard2': 61,
    'standard3': 83,
    'premium1': 55,
    'premium2': 99,
    'premium3': 132
  };
  function priceFilter() {
    return function (store, input) {
      if (store === 'iamport') {
        return iamport[input];
      } else {
        return appStore[input] * 1120;
      }
    };
  }
  angular.module('dataDashboard.common.filter.price', []).filter('price', priceFilter);
}());