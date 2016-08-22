(function () {
  'use strict';
  function CancelUserDataRouter($stateProvider) {
    $stateProvider.state('dashboard.cancelUserData', {
      templateUrl: 'app/cancel-userdata/cancel-userdata.html',
      url: '/cancel-userdata',
      controller: 'CancelUserDataController',
      controllerAs: 'cancelUserDataVm'
    });
  }
  CancelUserDataRouter.$inject = ['$stateProvider'];
  angular.module('dataDashboard.cancelUserData.CancelUserDataRouter', []).config(CancelUserDataRouter);
}());