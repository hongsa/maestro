(function () {
  'use strict';

  function CumulativeUserDataRouter($stateProvider) {
    $stateProvider
      .state('dashboard.cumulativeUserData', {
        templateUrl: 'app/cumulative-userdata/cumulative-userdata.html',
        url: '/cumulative-userdata',
        controller: 'CumulativeUserDataController',
        controllerAs: 'cumulativeUserDataVm'
      });
  }

  CumulativeUserDataRouter.$inject = ['$stateProvider'];

  angular.module('dataDashboard.cumulativeUserData.CumulativeUserDataRouter', [])
    .config(CumulativeUserDataRouter);
})();

