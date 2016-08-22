(function () {
  'use strict';
  angular.module('dataDashboard.cumulativeUserData', [
    // Controllers
    'dataDashboard.cumulativeUserData.controller.CumulativeUserDataController',
    // Services
    'dataDashboard.cumulativeUserData.service.CumulativeUserData',
    // Router
    'dataDashboard.cumulativeUserData.CumulativeUserDataRouter'
  ]);
}());