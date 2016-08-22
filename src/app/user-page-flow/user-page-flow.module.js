(function () {
  'use strict';
  angular.module('dataDashboard.userPageFlow', [
    // Controllers
    'dataDashboard.userPageFlow.controller.UserPageFlowController',
    // Services
    'dataDashboard.userPageFlow.service.UserPageFlow',
    // Router
    'dataDashboard.userPageFlow.UserPageFlowRouter'
  ]);
}());