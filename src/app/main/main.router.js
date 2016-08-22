(function () {
  'use strict';
  function MainRouter($stateProvider) {
    $stateProvider.state('dashboard', {
      url: '/dashboard',
      templateUrl: 'app/main/main.html'
    }).state('404', { templateUrl: 'app/main/404.html' });
  }
  MainRouter.$inject = ['$stateProvider'];
  angular.module('dataDashboard.main.MainRouter', []).config(MainRouter);
}());