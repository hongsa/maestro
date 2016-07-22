(function() {
  'use strict';

  angular.module('dataDashboard.downloadedCard', [
    // Controllers
    'dataDashboard.downloadedCard.controller.DownloadedCardController',

    // Services
    'dataDashboard.downloadedCard.service.DownloadedCard',

    // Router
    'dataDashboard.downloadedCard.DownloadedCardRouter'
  ]);
})();
