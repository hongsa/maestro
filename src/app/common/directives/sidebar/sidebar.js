(function () {
  'use strict';
  function Controller() {
    var vm = this;
    vm.selectedMenu = 'dashboard';
    vm.collapseVar = 0;
    vm.multiCollapseVar = 0;
    vm.check = check;
    vm.multiCheck = multiCheck;
    function check(x) {
      if (x === vm.collapseVar) {
        vm.collapseVar = 0;
      } else {
        vm.collapseVar = x;
      }
    }
    function multiCheck(y) {
      if (y === vm.multiCollapseVar) {
        vm.multiCollapseVar = 0;
      } else {
        vm.multiCollapseVar = y;
      }
    }
  }
  function sidebarDirective() {
    return {
      templateUrl: 'app/common/directives/sidebar/sidebar.html',
      restrict: 'E',
      replace: true,
      scope: {},
      controller: Controller,
      controllerAs: 'sidebarVm',
      bindToController: true
    };
  }
  angular.module('maestro.common.directive.sidebarDirective', []).directive('sidebar', sidebarDirective);
}());