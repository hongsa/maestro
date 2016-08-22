(function () {
  'use strict';
  var dayInMS = 86400000, dayInMSHalf = 43200000, today = new Date();
  function SubscribeUserData($http, $q, $filter, APP_CONFIG) {
    return {
      getSubscribeData: getSubscribeData,
      getSubscribeProportionData: getSubscribeProportionData
    };
    function getSubscribeData(dataContainer, selectedRange, roleFilter, deviceFilter, startDate, endDate) {
      var deferred = $q.defer(), query = createQueryString(dataContainer.id, roleFilter, deviceFilter, selectedRange, startDate, endDate), addDate;
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
    function getSubscribeProportionData(dataContainer, dataSubject, baseCumulativeData, startDate, endDate, currentTotal, type, chart) {
      var deferred = $q.defer(), query = 'SELECT count(*) FROM accum-stats-201*' + createPieChartQueryWhereFilter(type) + ' AND' + getDateFilterString(startDate, endDate) + 'GROUP BY ' + dataSubject;
      $http({
        url: APP_CONFIG.ELASTIC_SEARCH_SQL + '?sql=' + query,
        method: 'GET',
        headers: { 'Content-Type': undefined }
      }).then(function (result) {
        dataContainer.splice(0);
        currentTotal.value = 0;
        result.data.aggregations[dataSubject].buckets.forEach(function (row, i) {
          if (getTimeStampFromStr(startDate) <= 1446336000000) {
            dataContainer.push({
              name: dataSubject === 'country' ? $filter('country')(row.key) : row.key,
              y: (baseCumulativeData[row.key] || 0) + row.doc_count,
              color: APP_CONFIG.COLORS[i % 11]
            });
            currentTotal.value += (baseCumulativeData[row.key] || 0) + row.doc_count;
          } else {
            dataContainer.push({
              name: dataSubject === 'country' ? $filter('country')(row.key) : row.key,
              y: row.doc_count,
              color: APP_CONFIG.COLORS[i % 11]
            });
            currentTotal.value += row.doc_count;
          }
        });
        if (chart) {
          chart.hideLoading();
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
    function createQueryString(paymentFilter, roleFilter, deviceFilter, selectedRange, startDate, endDate) {
      var query = 'SELECT count(*) FROM stg-2016';
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
      if (paymentFilter === 'trial-basic') {
        payment = ' WHERE event="_null" AND change_payment_plan="basic"';
      } else if (paymentFilter === 'trial-standard') {
        payment = ' WHERE event="_null" AND change_payment_plan="standard"';
      } else if (paymentFilter === 'trial-premium') {
        payment = ' WHERE event="_null" AND change_payment_plan="premium"';
      } else if (paymentFilter === 'basic-subscribers') {
        payment = ' WHERE event="continue" AND change_payment_plan="basic"';
      } else if (paymentFilter === 'standard-subscribers') {
        payment = ' WHERE event="continue" AND change_payment_plan="standard"';
      } else if (paymentFilter === 'premium-subscribers') {
        payment = ' WHERE event="continue" AND change_payment_plan="premium"';
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
      var dayInMS = 86400000, startDateStr = getTimeStampFromStr(startDate) - dayInMS, endDateStr = getTimeStampFromStr(endDate);
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
  SubscribeUserData.$inject = [
    '$http',
    '$q',
    '$filter',
    'APP_CONFIG'
  ];
  angular.module('dataDashboard.subscribeUserData.service.SubscribeUserData', []).factory('SubscribeUserData', SubscribeUserData);
}());