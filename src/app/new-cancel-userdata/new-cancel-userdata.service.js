(function () {
  'use strict';
  var dayInMS = 86400000;

  function NewCancelUserData($http, $q, $filter, APP_CONFIG) {
    return {
      getNewCancelData: getNewCancelData,
      getNewCancelProportionData: getNewCancelProportionData
    };

    function getNewCancelData(dataContainer, selectedRange, roleFilter, deviceFilter, startDate, endDate) {
      var deferred = $q.defer(),
          query = createQueryString(dataContainer.id, roleFilter, deviceFilter, selectedRange, startDate, endDate);

      $http({
        url: APP_CONFIG.ELASTIC_SEARCH_SQL+ '?sql=' + query,
        method: 'GET',
        headers: {
          'Content-Type': undefined
        },
      }).then(function (result) {
        dataContainer.data.splice(0);
        result.data.aggregations.timestamp.buckets.forEach(function (row) {
          dataContainer.data.push([
            row.key,
            row.doc_count
          ]);
        });
        deferred.resolve({
          name :'success'
        });
      }, deferred.reject);
      return deferred.promise;
    }


    function getNewCancelProportionData(dataContainer, dataSubject, baseCumulativeData, startDate, endDate, currentTotal, type, chart) {
      var deferred = $q.defer(),
          query = 'SELECT count(*) FROM accum-stats-201*' + createPieChartQueryWhereFilter(type) + ' AND' + getDateFilterString(startDate, endDate) + 'GROUP BY ' + dataSubject;
      $http({
        url: APP_CONFIG.NEW_ELASTIC_SEARCH_SQL + '?sql=' + query,
        method: 'GET',
        headers: {
          'Content-Type': undefined
        }
      }).then(function (result) {
        dataContainer.splice(0);
        currentTotal.value = 0;

        result.data.aggregations[dataSubject].buckets.forEach(function (row, i) {
          if (getTimeStampFromStr(startDate) <= 1446336000000) {
            dataContainer.push({
              name: (dataSubject === 'country' ? $filter('country')(row.key) : row.key),
              y: (baseCumulativeData[row.key] || 0) + row.doc_count,
              color: APP_CONFIG.COLORS[i % 11]
            });
            currentTotal.value += (baseCumulativeData[row.key] || 0) + row.doc_count;
          }
          else {
            dataContainer.push({
              name: (dataSubject === 'country' ? $filter('country')(row.key) : row.key),
              y: row.doc_count,
              color: APP_CONFIG.COLORS[i % 11]
            });
            currentTotal.value += row.doc_count;
          }
        });
        if (chart) {
          chart.hideLoading();
        }

        deferred.resolve({
          name :'success'
        });
      }, deferred.reject);

      return deferred.promise;
    }

    function getTimeStampFromStr(date) {
      return new Date(date).getTime();
    }
    function createQueryString(paymentFilter, roleFilter, deviceFilter, selectedRange, startDate, endDate) {
      var query = 'SELECT count(*) FROM dashboard-2016.*';
      query += createWhereFilterString(paymentFilter, roleFilter, deviceFilter, startDate, endDate);
      query += createGroupByString(selectedRange);
      query += createOrderByString();

      return encodeURIComponent(query);
    }

    function createWhereFilterString(paymentFilter, roleFilter, deviceFilter, startDate, endDate) {
      var where = '';

      where += getPaymentFilterClause(paymentFilter);
      where += getRoleFilterClause(roleFilter);
      where += getDeviceFilterString(deviceFilter);
      where += getDateFilterString(startDate, endDate);

      return where;
    }

    function getPaymentFilterClause(paymentFilter) {
      if (paymentFilter === 'basic-free') {
        return ' WHERE now_payment="1" AND change_payment="0"';
      } else if (paymentFilter === 'standard-free') {
        return ' WHERE now_payment="2" AND change_payment="0"';
      } else if (paymentFilter === 'premium-free') {
        return ' WHERE now_payment="3" AND change_payment="0"';
      } else if (paymentFilter === 'standard-basic') {
        return ' WHERE now_payment="2" AND change_payment="1"';
      } else if (paymentFilter === 'premium-basic') {
        return ' WHERE now_payment="3" AND change_payment="1"';
      } else if (paymentFilter === 'premium-standard') {
        return ' WHERE now_payment="3" AND change_payment="2"';
      }
    }

    function createPieChartQueryWhereFilter(typeFilter) {
      var where = '';
      if (typeFilter == 'User Signups') {
        where = ' WHERE _type="user"';
      } else {
        where = ' WHERE _type="user-del"';
      }
      return where;
    }

    function getRoleFilterClause(roleFilter) {
      if (roleFilter === 'teacher') {
        return ' AND role="teacher"';
      } else if (roleFilter === 'student') {
        return ' AND role="student"';
      } else if (roleFilter === 'parent') {
        return ' AND role="parent"';
      } else {
        return '';
      }
    }

    function getDeviceFilterString(deviceFilter) {
      if (deviceFilter === 'android') {
        return ' AND app_version="a"';
      } else if (deviceFilter === 'ios') {
        return ' AND app_version="i"';
      } else {
        return '';
      }
    }

    function getDateFilterString(startDate, endDate) {
      var dayInMS = 86400000,
          startDateStr = getTimeStampFromStr(startDate) - dayInMS,
          endDateStr = getTimeStampFromStr(endDate);
      return ' AND @timestamp BETWEEN "' + startDateStr + '" AND "' + endDateStr + '"';
    }

    function createGroupByString(selectedRange) {
      if (selectedRange === 'daily') {
        return ' GROUP BY date_histogram("alias"="timestamp", field="@timestamp", "interval"="1d", "format"="yyyy-MM-dd", "time_zone"="+09:00")'
      } else if (selectedRange === 'weekly') {
        return ' GROUP BY date_histogram("alias"="timestamp", field="@timestamp", "interval"="1w", "format"="yyyy-MM-dd", "time_zone"="+09:00")'
      } else if (selectedRange === 'monthly'){
        return ' GROUP BY date_histogram("alias"="timestamp", field="@timestamp", "interval"="1M", "format"="yyyy-MM-dd", "time_zone"="+09:00")'
      } else {
        return ' GROUP BY date_histogram("alias"="timestamp", field="@timestamp", "interval"="1y", "format"="yyyy-MM-dd", "time_zone"="+09:00")'
      }
    }

    function createOrderByString() {
      return ' ORDER BY @timestamp ASC';
    }
  }

  NewCancelUserData.$inject = ['$http', '$q', '$filter', 'APP_CONFIG'];

  angular.module('dataDashboard.newCancelUserData.service.NewCancelUserData', [])
      .factory('NewCancelUserData', NewCancelUserData);
})();
