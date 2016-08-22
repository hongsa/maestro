(function () {
  'use strict';
  var dayInMS = 86400000, dayInMSHalf = 43200000, today = new Date();
  function MonthlyRecurringRevenue($http, $q, $filter, APP_CONFIG) {
    return { getMRR: getMRR };
    function getMRR(dataContainer, queryType, selectedRange, deviceFilter, startDate, endDate) {
      var deferred = $q.defer(), query = createQueryString(queryType, deviceFilter, selectedRange, startDate, endDate), addDate;
      if (queryType === 'increase') {
        dataContainer.data.splice(0);
      }
      $http({
        url: APP_CONFIG.ELASTIC_SEARCH_SQL + '?sql=' + query,
        method: 'GET',
        headers: { 'Content-Type': undefined }
      }).then(function (result) {
        if (!result.data.timed_out) {
          result.data.aggregations.timestamp.buckets.forEach(function (row) {
            var datePrice = 0, key;
            key = getKey(row.key, selectedRange);
            row.price.buckets.forEach(function (p) {
              if (p.key === 32 || p.key === 54) {
                datePrice += (p.key + 1) * p.doc_count * 1120;
              } else {
                datePrice += p.key * p.doc_count;
              }
            });
            if (queryType === 'increase') {
              dataContainer.data.push([
                key,
                datePrice
              ]);
            } else {
              for (var i = 0; i < dataContainer.data.length; i++) {
                if (row.key + dayInMSHalf === dataContainer.data[i][0]) {
                  dataContainer.data[i][1] -= datePrice;
                }
              }
            }
          });
        }
        deferred.resolve({ name: 'success' });
      }, deferred.reject);
      return deferred.promise;
    }
    function getTimeStampFromStr(date) {
      return new Date(date).getTime();
    }
    function getKey(key, selectedRange) {
      var calculateKey;
      if (selectedRange === 'daily') {
        calculateKey = key;
      } else if (selectedRange === 'weekly') {
        calculateKey = key + 6 * dayInMS;
      } else if (selectedRange === 'monthly') {
        calculateKey = new Date(new Date(key).getFullYear(), new Date(key).getMonth() + 2, 0, 23, 59, 59);
      } else {
        calculateKey = key * (364 * dayInMS);
      }
      if (calculateKey > today) {
        calculateKey = today.setHours(0, 0, 0, 0);
      }
      return calculateKey + dayInMSHalf;
    }
    function createQueryString(queryType, deviceFilter, selectedRange, startDate, endDate) {
      var query = 'SELECT count(*) FROM stg-2016';
      query += createWhereFilterString(queryType, deviceFilter, startDate, endDate);
      query += createGroupByString(selectedRange);
      query += createOrderByString();
      return encodeURIComponent(query);
    }
    function createWhereFilterString(queryType, deviceFilter, startDate, endDate) {
      var where = '';
      where += getPaymentFilterClause(queryType);
      where += getDeviceFilterString(deviceFilter);
      where += getDateFilterString(startDate, endDate);
      return where;
    }
    function getPaymentFilterClause(queryType) {
      var payment;
      if (queryType === 'increase') {
        payment = ' WHERE (event="_null" and now_payment_plan="_null") or (event="continue" and now_payment_plan<>"_null") and event<>"resume"';
      } else {
        //payment = ' WHERE event<>"_null" and event<>"continue" and event<>"resume" and event<>"stop"';
        payment = ' WHERE event="stop"';
      }
      return payment;
    }
    function getDeviceFilterString(deviceFilter) {
      var device;
      if (deviceFilter === 'android') {
        device = ' AND app_version="a"';
      } else if (deviceFilter === 'ios') {
        device = ' AND app_version="i"';
      } else {
        device = '';
      }
      return device;
    }
    function getDateFilterString(startDate, endDate) {
      var dayInMS = 86400000, startDateStr = getTimeStampFromStr(startDate) - dayInMS, endDateStr = getTimeStampFromStr(endDate);
      return ' AND @timestamp BETWEEN "' + startDateStr + '" AND "' + endDateStr + '"';
    }
    function createGroupByString(selectedRange) {
      if (selectedRange === 'daily') {
        return ' GROUP BY date_histogram("alias"="timestamp", field="@timestamp", "interval"="1d", "format"="yyyy-MM-dd", "time_zone"="+09:00"), price';
      } else if (selectedRange === 'weekly') {
        return ' GROUP BY date_histogram("alias"="timestamp", field="@timestamp", "interval"="1w", "format"="yyyy-MM-dd", "time_zone"="+09:00"), price';
      } else if (selectedRange === 'monthly') {
        return ' GROUP BY date_histogram("alias"="timestamp", field="@timestamp", "interval"="1M", "format"="yyyy-MM-dd", "time_zone"="+09:00"), price';
      } else {
        return ' GROUP BY date_histogram("alias"="timestamp", field="@timestamp", "interval"="1y", "format"="yyyy-MM-dd", "time_zone"="+09:00"), price';
      }
    }
    function createOrderByString() {
      return ' ORDER BY @timestamp ASC';
    }
  }
  MonthlyRecurringRevenue.$inject = [
    '$http',
    '$q',
    '$filter',
    'APP_CONFIG'
  ];
  angular.module('dataDashboard.monthlyRecurringRevenue.service.MonthlyRecurringRevenue', []).factory('MonthlyRecurringRevenue', MonthlyRecurringRevenue);
}());