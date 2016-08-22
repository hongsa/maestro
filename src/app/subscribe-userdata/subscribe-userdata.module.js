(function () {
  'use strict';
  angular.module('dataDashboard.subscribeUserData', [
    // Controllers
    'dataDashboard.subscribeUserData.controller.SubscribeUserDataController',
    // Services
    'dataDashboard.subscribeUserData.service.SubscribeUserData',
    // Router
    'dataDashboard.subscribeUserData.SubscribeUserDataRouter'
  ]);
}());