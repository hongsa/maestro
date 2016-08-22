(function () {
  'use strict';
  angular.module('dataDashboard.signin', [
    // Controllers
    'dataDashboard.signin.controller.SigninController',
    // Services
    'dataDashboard.signin.service.SigninService',
    // Router
    'dataDashboard.signin.SigninRouter'
  ]);
}());