(function () {
  'use strict';
  function MainConfig($urlRouterProvider) {
    $urlRouterProvider.otherwise('/dashboard/home');
  }
  MainConfig.$inject = ['$urlRouterProvider'];
  angular.module('dataDashboard.common.config.MainConfig', []).config(MainConfig);
}());