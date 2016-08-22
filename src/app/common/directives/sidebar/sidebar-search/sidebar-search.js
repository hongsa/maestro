(function () {
  'use strict';
  function Controller() {
    var vm = this;
    vm.selectedMenu = 'home';
  }
  function sidebarSearchDirective() {
    return {
      templateUrl: 'app/common/directives/sidebar/sidebar-search/sidebar-search.html',
      restrict: 'E',
      replace: true,
      scope: {},
      controller: Controller,
      controllerAs: 'sidebarSearchVm'
    };
  }
  angular.module('dataDashboard.common.directive.sidebarSearchDirective', []).directive('sidebarSearch', sidebarSearchDirective);
}());