(function () {
  'use strict';
  angular.module('dataDashboard.cardRate', [
    // Controllers
    'dataDashboard.cardRate.controller.CardRateController',
    'dataDashboard.cardRate.controller.RateModalController',
    // Services
    'dataDashboard.cardRate.service.CardRate',
    'dataDashboard.cardRate.service.RateModal',
    // Factory
    'dataDashboard.cardRate.factory.RateModalFactory',
    // Router
    'dataDashboard.cardRate.CardRateRouter'
  ]);
}());