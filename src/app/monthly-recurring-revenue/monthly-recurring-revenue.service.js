(function () {
  'use strict';
  var dayInMS = 86400000;
  var dayInMSHalf = 43200000;
  var today = new Date();
  function MonthlyRecurringRevenue($http, $q, $filter, APP_CONFIG) {
    return {
      getMRR: getMRR,
      getMRR2: getMRR2
    };
    function getMRR(dataContainer, queryType, selectedRange, deviceFilter, startDate, endDate) {
      var deferred = $q.defer();
      var query = createQueryString(queryType, deviceFilter, selectedRange, startDate, endDate);
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
            var datePrice = 0;
            var key;
            key = getKey(row.key, selectedRange);
            row.price.buckets.forEach(function (p) {
              if (p.key < 1000) {
                datePrice += (p.key) * p.doc_count * 1100;
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
    function getMRR2(dataContainer, queryType, selectedRange, deviceFilter, startDate, endDate) {
      var deferred = $q.defer();
      var query = createQueryString(queryType, deviceFilter, selectedRange, startDate, endDate);
      $http({
        url: APP_CONFIG.ELASTIC_SEARCH_SQL + '?sql=' + query,
        method: 'GET',
        headers: { 'Content-Type': undefined }
      }).then(function (result) {
        if (!result.data.timed_out) {
          result.data.aggregations.timestamp.buckets.forEach(function (row) {
            var datePrice = 0;
            row.now_payment_plan.buckets.forEach(function (nowPlan) {
              nowPlan.now_payment_children_limit.buckets.forEach(function (nowChildren) {
                nowChildren.change_payment_plan.buckets.forEach(function (changePlan) {
                  changePlan.change_payment_children_limit.buckets.forEach(function (changeChildren) {
                    var nowPrice = $filter('price')(queryType, nowPlan.key.toString() + nowChildren.key.toString());
                    var changePrice = $filter('price')(queryType, changePlan.key.toString() + changeChildren.key.toString());
                    datePrice += (changePrice - nowPrice) * changeChildren.doc_count;
                  });
                });
              });
            });
            for (var i = 0; i < dataContainer.data.length; i++) {
              if (row.key + dayInMSHalf === dataContainer.data[i][0]) {
                dataContainer.data[i][1] += datePrice;
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
      var query = 'SELECT count(*) FROM log-*';
      query += createWhereFilterString(queryType, deviceFilter, startDate, endDate);
      query += createGroupByString(queryType, selectedRange);
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
        payment = ' WHERE (user_id <> "30" AND user_id <> "1475" AND user_id <> "1520") AND (event="_null" and now_payment_plan="_null") or (event="continue" and now_payment_plan<>"_null") and event<>"resume"';
      } else if (queryType === 'decrease') {
        payment = ' WHERE (user_id <> "30" AND user_id <> "1475" AND user_id <> "1520") AND event="stop"';
      } else {
        payment = ' WHERE (user_id <> "30" AND user_id <> "1475" AND user_id <> "1520") AND event="_null" and now_payment_plan<>"_null" and payment_method=' + '"' + queryType + '"';
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
      var startDateStr = getTimeStampFromStr(startDate);
      var endDateStr = getTimeStampFromStr(endDate) + dayInMS;
      return ' AND @timestamp BETWEEN "' + startDateStr + '" AND "' + endDateStr + '"';
    }
    function createGroupByString(queryType, selectedRange) {
      if (queryType === 'increase' || queryType === 'decrease') {
        if (selectedRange === 'daily') {
          return ' GROUP BY date_histogram("alias"="timestamp", field="@timestamp", "interval"="1d", "format"="yyyy-MM-dd", "time_zone"="+09:00"), price';
        } else if (selectedRange === 'weekly') {
          return ' GROUP BY date_histogram("alias"="timestamp", field="@timestamp", "interval"="1w", "format"="yyyy-MM-dd", "time_zone"="+09:00"), price';
        } else if (selectedRange === 'monthly') {
          return ' GROUP BY date_histogram("alias"="timestamp", field="@timestamp", "interval"="1M", "format"="yyyy-MM-dd", "time_zone"="+09:00"), price';
        } else {
          return ' GROUP BY date_histogram("alias"="timestamp", field="@timestamp", "interval"="1y", "format"="yyyy-MM-dd", "time_zone"="+09:00"), price';
        }
      } else {
        if (selectedRange === 'daily') {
          return ' GROUP BY date_histogram("alias"="timestamp", field="@timestamp", "interval"="1d", "format"="yyyy-MM-dd", "time_zone"="+09:00"), now_payment_plan, now_payment_children_limit, change_payment_plan, change_payment_children_limit';
        } else if (selectedRange === 'weekly') {
          return ' GROUP BY date_histogram("alias"="timestamp", field="@timestamp", "interval"="1w", "format"="yyyy-MM-dd", "time_zone"="+09:00"), now_payment_plan, now_payment_children_limit, change_payment_plan, change_payment_children_limit';
        } else if (selectedRange === 'monthly') {
          return ' GROUP BY date_histogram("alias"="timestamp", field="@timestamp", "interval"="1M", "format"="yyyy-MM-dd", "time_zone"="+09:00"), now_payment_plan, now_payment_children_limit, change_payment_plan, change_payment_children_limit';
        } else {
          return ' GROUP BY date_histogram("alias"="timestamp", field="@timestamp", "interval"="1y", "format"="yyyy-MM-dd", "time_zone"="+09:00"), now_payment_plan, now_payment_children_limit, change_payment_plan, change_payment_children_limit';
        }
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