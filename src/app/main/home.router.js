(function () {
  'use strict';
  function HomeRouter($stateProvider) {
    $stateProvider.state('dashboard.home', {
      url: '/home',
      controller: 'MainController',
      templateUrl: 'app/main/home.html'
    });
  }
  HomeRouter.$inject = ['$stateProvider'];
  angular.module('dataDashboard.main.HomeRouter', []).config(HomeRouter);
}());