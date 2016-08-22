(function () {
  'use strict';
  angular.module('dataDashboard.activeUsers', [
    // Controllers
    'dataDashboard.activeUsers.controller.ActiveUsersController',
    // Services
    'dataDashboard.activeUsers.service.ActiveUsers',
    // Router
    'dataDashboard.activeUsers.ActiveUsersRouter'
  ]);
}());