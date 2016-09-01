(function () {
  'use strict';
  angular.module('dataDashboard.publisherRate', [
    // Controllers
    'dataDashboard.publisherRate.controller.PublisherRateController',
    // Services
    'dataDashboard.publisherRate.service.PublisherRate',
    // Router
    'dataDashboard.publisherRate.PublisherRateRouter'
  ]);
}());