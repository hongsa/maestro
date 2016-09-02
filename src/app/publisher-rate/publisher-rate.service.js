(function () {
  'use strict';
  function PublisherRate($http, $q, $rootScope, $filter, APP_CONFIG) {
    return {
      getPublisherRate: getPublisherRate,
      getSeriesRate: getSeriesRate,
      getPublisherKeys: getPublisherKeys
    };
    function getPublisherRate(dataContainer) {
      var deferred = $q.defer();
      var query = 'SELECT avg_rate, rate_cnt, publisher_id FROM lcrate LIMIT 10000';
      $http({
        url: APP_CONFIG.ELASTIC_SEARCH_SQL + '?sql=' + query,
        method: 'GET',
        headers: { 'Content-Type': undefined }
      }).then(function (result) {
        for (var key in dataContainer)
          delete dataContainer[key];
        result.data.hits.hits.forEach(function (row) {
          if (dataContainer.hasOwnProperty(row._source.publisher_id)) {
            dataContainer[row._source.publisher_id][0] += row._source.avg_rate * row._source.rate_cnt;
            dataContainer[row._source.publisher_id][1] += row._source.rate_cnt;
          } else {
            dataContainer[row._source.publisher_id] = [
              row._source.avg_rate * row._source.rate_cnt,
              row._source.rate_cnt
            ];
          }
        });
        deferred.resolve({ name: 'success' });
      }, deferred.reject);
      return deferred.promise;
    }
    function getSeriesRate(dataContainer, publisher_id) {
      var deferred = $q.defer();
      var query = 'SELECT avg_rate, rate_cnt, series_id FROM lcrate WHERE publisher_id=' + '"' + publisher_id + '"';
      $http({
        url: APP_CONFIG.ELASTIC_SEARCH_SQL + '?sql=' + query,
        method: 'GET',
        headers: { 'Content-Type': undefined }
      }).then(function (result) {
        for (var key in dataContainer)
          delete dataContainer[key];
        result.data.hits.hits.forEach(function (row) {
          if (dataContainer.hasOwnProperty(row._source.series_id)) {
            dataContainer[row._source.series_id][0] += row._source.avg_rate * row._source.rate_cnt;
            dataContainer[row._source.series_id][1] += row._source.rate_cnt;
          } else {
            dataContainer[row._source.series_id] = [
              row._source.avg_rate * row._source.rate_cnt,
              row._source.rate_cnt
            ];
          }
        });
        deferred.resolve({ name: 'success' });
      }, deferred.reject);
      return deferred.promise;
    }
    function getPublisherKeys(publisherKeyContainer) {
      var deferred = $q.defer();
      var query = 'SELECT publisher_id from lcrate GROUP BY publisher_id';
      $http({
        url: APP_CONFIG.ELASTIC_SEARCH_SQL + '?sql=' + query,
        method: 'GET',
        headers: { 'Content-Type': undefined }
      }).then(function (result) {
        if (!result.data.timed_out && result.data.aggregations) {
          publisherKeyContainer.splice(0);
          publisherKeyContainer.push(-1);
          result.data.aggregations.publisher_id.buckets.forEach(function (row) {
            if (publisherKeyContainer.indexOf(row.key) === -1) {
              publisherKeyContainer.push(row.key);
            }
          });
        }
        deferred.resolve();
      }, deferred.reject);
      return deferred.promise;
    }
  }
  PublisherRate.$inject = [
    '$http',
    '$q',
    '$rootScope',
    '$filter',
    'APP_CONFIG'
  ];
  angular.module('dataDashboard.publisherRate.service.PublisherRate', []).factory('PublisherRate', PublisherRate);
}());