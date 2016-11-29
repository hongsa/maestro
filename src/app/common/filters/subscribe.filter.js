(function () {
  'use strict';
  var subscribeNames = {
    'newUser': '신규 구독 (환불 제외)',
    'continueUser': '누적 구독 (구독 해지 제외)',
    'stopUser':'구독 해지',
    'refundUser' : '환불',
    'totalUser' : '전체 구독'
  };
  function subscribeFilter() {
    return function (input) {
      return subscribeNames[input];
    };
  }
  angular.module('dataDashboard.common.filter.subscribe', []).filter('subscribe', subscribeFilter);
}());