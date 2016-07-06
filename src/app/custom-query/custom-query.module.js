(function() {
  'use strict';

  angular.module('dataDashboard.customQuery', [
    // Controllers
    'dataDashboard.customQuery.controller.CustomQueryController',

    // Services
    'dataDashboard.customQuery.service.CustomQuery',

    // Router
    'dataDashboard.customQuery.CustomQueryRouter'
  ]);
})();
