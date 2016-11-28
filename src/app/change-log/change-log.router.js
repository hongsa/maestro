(function () {
  'use strict';

  function ChangeLogRouter($stateProvider) {
    $stateProvider
      .state('changeLog', {
        templateUrl: 'app/change-log/change-log.html',
        url: '/change-log',
        controller: 'ChangeLogController',
        controllerAs: 'changeLogVm'
      });
  }

  ChangeLogRouter.$inject = ['$stateProvider'];

  angular.module('dataDashboard.changeLog.ChangeLogRouter', [])
    .config(ChangeLogRouter);
})();

