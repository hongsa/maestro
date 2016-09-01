(function () {
  'use strict';
  function PublisherRateRouter($stateProvider) {
    $stateProvider.state('dashboard.publisherRate', {
      templateUrl: 'app/publisher-rate/publisher-rate.html',
      url: '/publisher-rate',
      controller: 'PublisherRateController',
      controllerAs: 'publisherRateVm'
    });
  }
  PublisherRateRouter.$inject = ['$stateProvider'];
  angular.module('dataDashboard.publisherRate.PublisherRateRouter', []).config(PublisherRateRouter);
}());