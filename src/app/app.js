(function () {
  'use strict';
  angular.module('maestro', [
    'ngMessages',
    'ui.router',
    'ui.bootstrap',
    'ui.bootstrap.showErrors',
    'angular-loading-bar',
    'highcharts-ng',
    'ngVis',
    'ngAnimate',
    'ngLodash',
    'hc.marked',
    // Common
    'maestro.common',
    // Main
    'maestro.main',
    //Unit Tree
    'maestro.unitTree',
    //Select Role
    'maestro.role'
  ]);
}());