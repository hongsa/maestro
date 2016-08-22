(function () {
  'use strict';
  function MobileStoreStats($http, $q, APP_CONFIG, CSVparserUtils) {
    return {
      getAndroidInstallsOverviewStats: getAndroidInstallsOverviewStats,
      getAndroidLanguageStats: getAndroidLanguageStats,
      getAndroidCountryStats: getAndroidCountryStats
    };
    function getAndroidInstallsOverviewStats(csvContainer, yearMonth, updateDataCB) {
      var deferred = $q.defer();
      $http({
        url: APP_CONFIG.S3_DATA_BUCKET + '/googleplay_reports/googleplay_reports_' + yearMonth + '/installs/installs_com.Classting_' + yearMonth + '_overview.csv',
        method: 'GET',
        headers: { 'Content-Type': undefined }
      }).then(function (result) {
        if (csvContainer) {
          csvContainer.androidInstallsOverview = CSVparserUtils.csvParser(result.data);
          updateDataCB();
        } else {
          updateDataCB(result.data, true, 'android_installs_' + yearMonth + '_overview.csv');
        }
        deferred.resolve();
      }, deferred.reject);
      return deferred.promise;
    }
    function getAndroidLanguageStats(csvContainer, yearMonth, updateDataCB) {
      var deferred = $q.defer();
      $http({
        url: APP_CONFIG.S3_DATA_BUCKET + '/googleplay_reports/googleplay_reports_' + yearMonth + '/installs/installs_com.Classting_' + yearMonth + '_language.csv',
        method: 'GET',
        headers: { 'Content-Type': undefined }
      }).then(function (result) {
        if (csvContainer) {
          csvContainer.androidLanguageStats = CSVparserUtils.csvParser(result.data);
          updateDataCB();
        } else {
          updateDataCB(result.data, true, 'android_installs_' + yearMonth + '_language.csv');
        }
        deferred.resolve();
      }, deferred.reject);
      return deferred.promise;
    }
    function getAndroidCountryStats(csvContainer, yearMonth, updateDataCB) {
      var deferred = $q.defer();
      $http({
        url: APP_CONFIG.S3_DATA_BUCKET + '/googleplay_reports/googleplay_reports_' + yearMonth + '/installs/installs_com.Classting_' + yearMonth + '_country.csv',
        method: 'GET',
        headers: { 'Content-Type': undefined }
      }).then(function (result) {
        if (csvContainer) {
          csvContainer.androidCountryStats = CSVparserUtils.csvParser(result.data);
          updateDataCB();
        } else {
          updateDataCB(result.data, true, 'android_installs_' + yearMonth + '_country.csv');
        }
        deferred.resolve();
      }, deferred.reject);
      return deferred.promise;
    }
  }
  MobileStoreStats.$inject = [
    '$http',
    '$q',
    'APP_CONFIG',
    'CSVparserUtils'
  ];
  angular.module('dataDashboard.mobileStoreStats.service.MobileStoreStats', []).factory('MobileStoreStats', MobileStoreStats);
}());