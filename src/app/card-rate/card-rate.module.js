(function() {
  'use strict';

  angular.module('dataDashboard.cardRate', [
    // Controllers
    'dataDashboard.cardRate.controller.CardRateController',

    // Services
    'dataDashboard.cardRate.service.CardRate',

    // Router
    'dataDashboard.cardRate.CardRateRouter'
  ]);
})();
