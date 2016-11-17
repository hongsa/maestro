(function () {
  'use strict';
  function AARRRRouter($stateProvider) {
    $stateProvider.state('dashboard.aarrr', {
      templateUrl: 'app/aarrr/aarrr.html',
      url: '/aarrr',
      controller: 'AARRRController',
      controllerAs: 'aarrrVm'
    });
  }
  AARRRRouter.$inject = ['$stateProvider'];
  angular.module('dataDashboard.aarrr.AARRRRouter', []).config(AARRRRouter);
}());