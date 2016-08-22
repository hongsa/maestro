(function () {
  'use strict';
  function ActiveUsersRouter($stateProvider) {
    $stateProvider.state('dashboard.activeUsers', {
      templateUrl: 'app/active-users/active-users.html',
      url: '/active-users',
      controller: 'ActiveUsersController',
      controllerAs: 'activeUsersVm'
    });
  }
  ActiveUsersRouter.$inject = ['$stateProvider'];
  angular.module('dataDashboard.activeUsers.ActiveUsersRouter', []).config(ActiveUsersRouter);
}());