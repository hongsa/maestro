(function () {
  'use strict';
  function MainRouter($stateProvider) {
    $stateProvider.state('maestro', {
      url: '/maestro',
      templateUrl: 'app/main/main.html'
    }).state('404', { templateUrl: 'app/main/404.html' });
  }
  MainRouter.$inject = ['$stateProvider'];
  angular.module('maestro.main.MainRouter', []).config(MainRouter);
}());