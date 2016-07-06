(function () {
  'use strict';

  function NewCancelUserDataRouter($stateProvider) {
    $stateProvider
      .state('dashboard.newCancelUserData', {
        templateUrl: 'app/new-cancel-userdata/new-cancel-userdata.html',
        url: '/new-cancel-userdata',
        controller: 'NewCancelUserDataController',
        controllerAs: 'newCancelUserDataVm'
      });
  }

  NewCancelUserDataRouter.$inject = ['$stateProvider'];

  angular.module('dataDashboard.newCancelUserData.NewCancelUserDataRouter', [])
    .config(NewCancelUserDataRouter);
})();

