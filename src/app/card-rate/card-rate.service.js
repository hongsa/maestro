(function() {
  'use strict';

  function CardRate($http, $q, $rootScope, $filter, APP_CONFIG) {
    return {
      getCardRate: getCardRate,
    };

    function getCardRate(dataContainer, minAvgFilter, maxAvgFilter, minRateCountFilter, maxRateCountFilter, typeFilter) {
      var deferred = $q.defer(),
          query = createQueryString(minAvgFilter, maxAvgFilter, minRateCountFilter, maxRateCountFilter, typeFilter);

      $http({
        url: APP_CONFIG.ELASTIC_SEARCH_SQL + '?sql=' + query,
        method: 'GET',
        headers: {
          'Content-Type': undefined
        }
      }).then(function(result) {
        dataContainer.splice(0);
        result.data.hits.hits.forEach(function(row) {
          dataContainer.push({
            id: row._source.id,
            avg_rate: row._source.avg_rate,
            rate_cnt: row._source.rate_cnt,
            subject_id: row._source.subject_id,
            grade_id: row._source.grade_id,
            curr_type: row._source.curr_type,
            publisher_id: row._source.publisher_id
          });
        });
        deferred.resolve({
          name: 'success',
        });
      }, deferred.reject);

      return deferred.promise;
    }

    function createQueryString(minAvgFilter, maxAvgFilter, minRateCountFilter, maxRateCountFilter, typeFilter) {
      var query = 'SELECT * FROM lcrate';
      query += createWhereFilterString(minAvgFilter, maxAvgFilter, minRateCountFilter, maxRateCountFilter, typeFilter);
      query += createOrderByString();

      return query
    }

    function createWhereFilterString(minAvgFilter, maxAvgFilter, minRateCountFilter, maxRateCountFilter, typeFilter) {
      var where = '';

      where += getMinAvfFilterClause(minAvgFilter, maxAvgFilter);
      where += getRateCountFilterClause(minRateCountFilter, maxRateCountFilter);
      where += getTypeFilterClause(typeFilter);

      return where;
    }

    function getMinAvfFilterClause(minAvgFilter, maxAvgFilter) {
      return ' WHERE (avg_rate>=' + minAvgFilter + ' and avg_rate<=' + maxAvgFilter + ')'
    }

    function getRateCountFilterClause(rateCountFilter, maxRateCountFilter) {
      return ' AND (rate_cnt>=' + rateCountFilter + ' and rate_cnt<=' + maxRateCountFilter + ')'
    }

    function getTypeFilterClause(typeFilter) {
      if (typeFilter === 'official') {
        return ' AND curr_type="official"'
      } else if (typeFilter === 'extra') {
        return ' AND curr_type="extra"'
      } else {
        return ''
      }
    }

    function createOrderByString() {
      return ' ORDER BY avg_rate DESC LIMIT 1000';
    }

  }

  CardRate.$inject = ['$http', '$q', '$rootScope', '$filter', 'APP_CONFIG'];

  angular.module('dataDashboard.cardRate.service.CardRate', [])
    .factory('CardRate', CardRate);
})();
