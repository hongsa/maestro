(function () {
  'use strict';

  function MobileStoreStatsRouter($stateProvider) {
    $stateProvider
      .state('dashboard.mobileStoreStats', {
        templateUrl: 'app/mobile-store-stats/mobile-store-stats.html',
        url: '/mobile-store-stats',
        controller: 'MobileStoreStatsController',
        controllerAs: 'mobileStoreStatsVm',
      })
      .state('dashboard.mobileStoreStats.main', {
        url: '/main',
        views: {
          'android-daily-device-stats': {
            templateUrl: 'app/mobile-store-stats/android-daily-device-stats/android-daily-device-stats.html',
            controller: 'AndroidDailyDeviceStatsController',
            controllerAs: 'androidDailyDeviceStatsVm'
          },
          'android-daily-user-stats': {
            templateUrl: 'app/mobile-store-stats/android-daily-user-stats/android-daily-user-stats.html',
            controller: 'AndroidDailyUserStatsController',
            controllerAs: 'androidDailyUserStatsVm'
          },
          'android-cumulative-stats': {
            templateUrl: 'app/mobile-store-stats/android-cumulative-stats/android-cumulative-stats.html',
            controller: 'AndroidCumulativeStatsController',
            controllerAs: 'androidCumulativeStatsVm'
          },
          'android-language-stats': {
            templateUrl: 'app/mobile-store-stats/android-language-stats/android-language-stats.html',
            controller: 'AndroidLanguageStatsController',
            controllerAs: 'androidLanguageStatsVm'
          },
          'android-country-stats': {
            templateUrl: 'app/mobile-store-stats/android-country-stats/android-country-stats.html',
            controller: 'AndroidCountryStatsController',
            controllerAs: 'androidCountryStatsVm'
          }
        }
      });
  }

  MobileStoreStatsRouter.$inject = ['$stateProvider'];

  angular.module('dataDashboard.mobileStoreStats.MobileStoreStatsRouter', [])
    .config(MobileStoreStatsRouter);
})();

