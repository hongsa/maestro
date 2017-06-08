(function () {
  'use strict';

  function UnitTreeRouter($stateProvider) {
    $stateProvider
      .state('unitTree', {
        templateUrl: 'app/unit-tree/unit-tree.html',
        url: '/unit-tree/:node',
        controller: 'UnitTreeController',
        controllerAs: 'unitTreeVm',
      });
  }

  UnitTreeRouter.$inject = ['$stateProvider'];

  angular.module('maestro.unitTree.UnitTreeRouter', [])
    .config(UnitTreeRouter);
})();

