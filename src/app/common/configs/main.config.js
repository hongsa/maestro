(function () {
  'use strict';
  function MainConfig($urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
  }
  MainConfig.$inject = ['$urlRouterProvider'];
  angular.module('maestro.common.config.MainConfig', []).config(MainConfig);
}());