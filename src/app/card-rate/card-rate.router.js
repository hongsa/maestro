(function () {
  'use strict';
  function CardRateRouter($stateProvider) {
    $stateProvider.state('dashboard.cardRate', {
      templateUrl: 'app/card-rate/card-rate.html',
      url: '/card-rate',
      controller: 'CardRateController',
      controllerAs: 'cardRateVm'
    });
  }
  CardRateRouter.$inject = ['$stateProvider'];
  angular.module('dataDashboard.cardRate.CardRateRouter', []).config(CardRateRouter);
}());