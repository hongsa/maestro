(function () {
  'use strict';
  var deviceNames = {
    'android': 'Android',
    'ios': 'iOS',
    'web': 'Web'
  };
  function deviceFilter() {
    return function (input) {
      if (input === 'all') {
        return 'All';
      } else if (deviceNames[input.toLowerCase()]) {
        return deviceNames[input.toLowerCase()];
      } else {
        return input;
      }
    };
  }
  angular.module('dataDashboard.common.filter.device', []).filter('device', deviceFilter);
}());