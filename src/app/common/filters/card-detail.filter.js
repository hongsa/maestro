(function () {
  'use strict';

  function cardDetailFilter() {
    return function (input) {
      return Math.floor(input * 100);
    };
  }

  angular.module('maestro.common.filter.cardDetail', []).filter('cardDetail', cardDetailFilter);
}());