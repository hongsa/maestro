(function () {
  'use strict';
  function DownloadedCardRouter($stateProvider) {
    $stateProvider.state('dashboard.downloadedCard', {
      templateUrl: 'app/downloaded-card/downloaded-card.html',
      url: '/downloaded-card',
      controller: 'DownloadedCardController',
      controllerAs: 'downloadedCardVm'
    });
  }
  DownloadedCardRouter.$inject = ['$stateProvider'];
  angular.module('dataDashboard.downloadedCard.DownloadedCardRouter', []).config(DownloadedCardRouter);
}());