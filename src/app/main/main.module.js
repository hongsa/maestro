(function () {
  'use strict';
  angular.module('dataDashboard.main', [
    // Controllers
    'dataDashboard.main.controller.MainController',
    // Router
    'dataDashboard.main.MainRouter',
    'dataDashboard.main.HomeRouter'
  ]);
}());