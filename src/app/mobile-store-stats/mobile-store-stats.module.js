(function () {
  'use strict';
  angular.module('dataDashboard.mobileStoreStats', [
    // Controllers
    'dataDashboard.mobileStoreStats.controller.MobileStoreStatsController',
    'dataDashboard.mobileStoreStats.controller.AndroidDailyDeviceStatsController',
    'dataDashboard.mobileStoreStats.controller.AndroidDailyUserStatsController',
    'dataDashboard.mobileStoreStats.controller.AndroidCumulativeStatsController',
    'dataDashboard.mobileStoreStats.controller.AndroidLanguageStatsController',
    'dataDashboard.mobileStoreStats.controller.AndroidCountryStatsController',
    // Services
    'dataDashboard.mobileStoreStats.service.MobileStoreStats',
    // Router
    'dataDashboard.mobileStoreStats.MobileStoreStatsRouter'
  ]);
}());