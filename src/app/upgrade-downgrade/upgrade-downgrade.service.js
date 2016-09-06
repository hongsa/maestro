(function () {
  'use strict';
  var dayInMS = 86400000;
  var dayInMSHalf = 43200000;
  var today = new Date();
  function UpgradeDowngrade($http, $q, $filter, APP_CONFIG) {
    return {
      getUpgradeDowngradeData: getUpgradeDowngradeData,
    };
    function getUpgradeDowngradeData(dataContainer, selectedRange, roleFilter, deviceFilter, startDate, endDate) {
      var deferred = $q.defer();
      var query = createQueryString(dataContainer.id, roleFilter, deviceFilter, selectedRange, startDate, endDate);
      $http({
        url: APP_CONFIG.ELASTIC_SEARCH_SQL + '?sql=' + query,
        method: 'GET',
        headers: { 'Content-Type': undefined }
      }).then(function (result) {
        dataContainer.data.splice(0);
        result.data.aggregations.timestamp.buckets.forEach(function (row) {
          var key;
          key = getKey(row.key, selectedRange);
          dataContainer.data.push([
            key,
            row.doc_count
          ]);
        });
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
        calculateKey = new Date(new Date(key).getFullYear(), new Date(key).getMonth() + 1, 0, 0, 0, 0);
      } else {
        calculateKey = key * (364 * dayInMS);
      }
      if (new Date(calculateKey).getTime() > new Date(today).getTime()) {
        calculateKey = today.setHours(0, 0, 0, 0);
      }
      return new Date(calculateKey).getTime() + dayInMSHalf;
    }
    function createQueryString(paymentFilter, roleFilter, deviceFilter, selectedRange, startDate, endDate) {
      var query = 'SELECT count(*) FROM log-*';
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
      var payment;
      if (paymentFilter === 'basic-standard') {
        payment = ' WHERE (user_id <> "30" AND user_id <> "1475" AND user_id <> "1520") AND event="_null" AND now_payment_plan="basic" AND change_payment_plan="standard"';
      } else if (paymentFilter === 'basic-premium') {
        payment = ' WHERE (user_id <> "30" AND user_id <> "1475" AND user_id <> "1520") AND event="_null" AND now_payment_plan="basic" AND change_payment_plan="premium"';
      } else if (paymentFilter === 'standard-premium') {
        payment = ' WHERE (user_id <> "30" AND user_id <> "1475" AND user_id <> "1520") AND event="_null" AND now_payment_plan="standard" AND change_payment_plan="premium"';
      } else if (paymentFilter === 'standard-basic') {
        payment = ' WHERE (user_id <> "30" AND user_id <> "1475" AND user_id <> "1520") AND event="_null" AND now_payment_plan="standard" AND change_payment_plan="basic"';
      } else if (paymentFilter === 'premium-standard') {
        payment = ' WHERE (user_id <> "30" AND user_id <> "1475" AND user_id <> "1520") AND event="_null" AND now_payment_plan="premium" AND change_payment_plan="standard"';
      } else if (paymentFilter === 'premium-basic') {
        payment = ' WHERE (user_id <> "30" AND user_id <> "1475" AND user_id <> "1520") AND event="_null" AND now_payment_plan="premium" AND change_payment_plan="basic"';
      }
      return payment;
    }
    function createPieChartQueryWhereFilter(typeFilter) {
      var where = '';
      if (typeFilter === 'User Signups') {
        where = ' WHERE _type="user"';
      } else {
        where = ' WHERE _type="user-del"';
      }
      return where;
    }
    function getRoleFilterClause(roleFilter) {
      var role;
      if (roleFilter === 'teacher') {
        role = ' AND role="teacher"';
      } else if (roleFilter === 'student') {
        role = ' AND role="student"';
      } else if (roleFilter === 'parent') {
        role = ' AND role="parent"';
      } else {
        role = '';
      }
      return role;
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
      var dayInMS = 86400000;
      var startDateStr = getTimeStampFromStr(startDate) - dayInMS;
      var endDateStr = getTimeStampFromStr(endDate);
      return ' AND @timestamp BETWEEN "' + startDateStr + '" AND "' + endDateStr + '"';
    }
    function createGroupByString(selectedRange) {
      var groupBy;
      if (selectedRange === 'daily') {
        groupBy = ' GROUP BY date_histogram("alias"="timestamp", field="@timestamp", "interval"="1d", "format"="yyyy-MM-dd", "time_zone"="+09:00")';
      } else if (selectedRange === 'weekly') {
        groupBy = ' GROUP BY date_histogram("alias"="timestamp", field="@timestamp", "interval"="1w", "format"="yyyy-MM-dd", "time_zone"="+09:00")';
      } else if (selectedRange === 'monthly') {
        groupBy = ' GROUP BY date_histogram("alias"="timestamp", field="@timestamp", "interval"="1M", "format"="yyyy-MM-dd", "time_zone"="+09:00")';
      } else {
        groupBy = ' GROUP BY date_histogram("alias"="timestamp", field="@timestamp", "interval"="1y", "format"="yyyy-MM-dd", "time_zone"="+09:00")';
      }
      return groupBy;
    }
    function createOrderByString() {
      return ' ORDER BY @timestamp ASC';
    }
  }
  UpgradeDowngrade.$inject = [
    '$http',
    '$q',
    '$filter',
    'APP_CONFIG'
  ];
  angular.module('dataDashboard.upgradeDowngrade.service.UpgradeDowngrade', []).factory('UpgradeDowngrade', UpgradeDowngrade);
}());