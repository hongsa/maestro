(function () {
  'use strict';

  function achievementFilter() {
    return function (input) {
      if (input > 80 && input <= 100) {
        return '매우 좋음(' + (Math.ceil(input)).toString() + ')';
      } else if (input > 60 && input <= 80) {
        return '좋음(' + (Math.ceil(input)).toString() + ')';
      } else if (input > 40 && input <= 60) {
        return '중간(' + (Math.ceil(input)).toString() + ')';
      } else if (input > 20 && input <= 40) {
        return '나쁨(' + (Math.ceil(input)).toString() + ')';
      } else if (input >= 0 && input <= 20) {
        return '매우 나쁨(' + (Math.ceil(input)).toString() + ')';
      }

    };
  }

  angular.module('maestro.common.filter.achievement', []).filter('achievement', achievementFilter);
}());