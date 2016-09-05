(function () {
  'use strict';
  function RateModalFactory($http, $q, APP_CONFIG) {
    return { getRateData: getRateData };
    function getRateData(dataContainer, cardId) {
      var deferred = $q.defer(), query = createQueryString(cardId);
      $http({
        url: APP_CONFIG.ELASTIC_SEARCH_SQL + '?sql=' + query,
        method: 'GET',
        headers: { 'Content-Type': undefined }
      }).then(function (result) {
        if (!result.data.timed_out && result.data.hits) {
          dataContainer.splice(0);
          result.data.aggregations.timestamp.buckets.forEach(function (row) {
            var totalRate = 0;
            var count = 0;
            row.rate.buckets.forEach(function (r) {
              totalRate += r.key * r.doc_count;
              count += r.doc_count;
            });
            dataContainer.push([
              row.key,
              totalRate,
              count
            ]);
          });
        }
        deferred.resolve();
      }, deferred.reject);
      return deferred.promise;
    }
    function createQueryString(cardId) {
      var query = 'SELECT * from log-* where _type ="result" AND rate <> "-1" and card_id=' + cardId + ' GROUP BY date_histogram("alias"="timestamp", field="@timestamp","interval"="1d"), rate';
      return query;
    }
  }
  RateModalFactory.$inject = [
    '$http',
    '$q',
    'APP_CONFIG'
  ];
  angular.module('dataDashboard.cardRate.factory.RateModalFactory', []).factory('RateModalFactory', RateModalFactory);
}());