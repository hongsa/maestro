(function () {
  'use strict';
  function RoleRouter($stateProvider) {
    $stateProvider.state('role', {
      url: '/',
      templateUrl: 'app/select-role/select-role.html'
    });
  }
  RoleRouter.$inject = ['$stateProvider'];
  angular.module('maestro.role.RoleRouter', []).config(RoleRouter);
}());