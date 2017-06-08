(function () {
  'use strict';
  function headerDirective() {
    return {
      templateUrl: 'app/common/directives/header/header.html',
      restrict: 'E',
      replace: true
    };
  }
  angular.module('maestro.common.directive.headerDirective', []).directive('header', headerDirective);
}());