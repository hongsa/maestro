(function () {
  'use strict';

  function titleCaseFilter() {
    return function(input) {
      input = input || '';
      return input.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    };
  }

  angular.module('dataDashboard.common.filter.titleCase', [])
    .filter('titleCase', titleCaseFilter);
})();