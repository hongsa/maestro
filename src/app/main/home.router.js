(function () {
  'use strict';
  function HomeRouter($stateProvider) {
    $stateProvider.state('maestro.home', {
      url: '/home',
      controller: 'MainController',
      controllerAs: 'mainVm',
      templateUrl: 'app/main/home.html'
    });
  }
  HomeRouter.$inject = ['$stateProvider'];
  angular.module('maestro.main.HomeRouter', []).config(HomeRouter);
}());