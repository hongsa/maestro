(function () {
  'use strict';

  function NewPaidUserDataRouter($stateProvider) {
    $stateProvider
      .state('dashboard.newPaidUserData', {
        templateUrl: 'app/new-paid-userdata/new-paid-userdata.html',
        url: '/new-paid-userdata',
        controller: 'NewPaidUserDataController',
        controllerAs: 'newPaidUserDataVm'
      });
  }

  NewPaidUserDataRouter.$inject = ['$stateProvider'];

  angular.module('dataDashboard.newPaidUserData.NewPaidUserDataRouter', [])
    .config(NewPaidUserDataRouter);
})();

