(function () {
  'use strict';

  function CustomQueryRouter($stateProvider) {
    $stateProvider
      .state('dashboard.customQuery', {
        templateUrl: 'app/custom-query/custom-query.html',
        url: '/custom-query',
        controller: 'CustomQueryController',
        controllerAs: 'customQueryVm',
      });
  }

  CustomQueryRouter.$inject = ['$stateProvider'];

  angular.module('dataDashboard.customQuery.CustomQueryRouter', [])
    .config(CustomQueryRouter);
})();

