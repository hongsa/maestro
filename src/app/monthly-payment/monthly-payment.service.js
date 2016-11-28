(function () {
  'use strict';
  var dayInMS = 86400000;
  function MonthlyPayment($http, $q, $filter, lodash, APP_CONFIG) {
    return {
      getNewSubscribers: getNewSubscribers,
      getContinueSubscribers: getContinueSubscribers
    };
    function getNewSubscribers(selectedDate, selectedDevice) {
      var deferred = $q.defer();
      var startDate = dateMonthSet(0, selectedDate)[0];
      var endDate = dateMonthSet(0, selectedDate)[1];
      var query = createQueryString('new', startDate, endDate, selectedDevice);
      var newContainer = [],
          stopContainer = [],
          refundContainer = [];
          $http({
        url: APP_CONFIG.ELASTIC_SEARCH_SQL + '?sql=' + query,
        method: 'GET',
        headers: { 'Content-Type': undefined }
      }).then(function (result) {
        result.data.hits.hits.forEach(function (row) {
          if (row._source.event === '_null' && checkTestId(row._source.user_id) === false) {
            if (newContainer.indexOf(row._source.user_id) === -1) {
              newContainer.push(row._source.user_id);
            }
          } else if (row._source.event === 'stop' && checkTestId(row._source.user_id) === false) {
            if (stopContainer.indexOf(row._source.user_id) === -1) {
              stopContainer.push(row._source.user_id);
            }
          } else if (row._source.event === 'refund' && checkTestId(row._source.user_id) === false) {
            if (refundContainer.indexOf(row._source.user_id) === -1 && checkTestId(row._source.user_id) === false) {
              refundContainer.push(row._source.user_id);
            }
          }
        });
        newContainer = compareData(newContainer, refundContainer);
        deferred.resolve({ status: result.status, date:selectedDate, newUser: newContainer, stopUser:stopContainer, refundUser:refundContainer });
      }, deferred.reject);
      return deferred.promise;
    }

    function getContinueSubscribers(selectedDate, selectedDevice) {
      var deferred = $q.defer();
      var startDate = dateMonthSet(1, selectedDate)[0];
      var endDate = dateMonthSet(1, selectedDate)[1];
      var query = createQueryString('continue', startDate, endDate, selectedDevice);
      var stopRefundUser = [],
          continueContainer = [];
      $http({
        url: APP_CONFIG.ELASTIC_SEARCH_SQL + '?sql=' + query,
        method: 'GET',
        headers: { 'Content-Type': undefined }
      }).then(function (result) {
        result.data.hits.hits.forEach(function (row) {
          if (row._source.event === '_null' && checkTestId(row._source.user_id) === false) {
            if (continueContainer.indexOf(row._source.user_id) === -1) {
              continueContainer.push(row._source.user_id);
            }
          } else if ((row._source.event === 'stop' || row._source.event === 'refund') && checkTestId(row._source.user_id) === false) {
            if (stopRefundUser.indexOf(row._source.user_id) === -1) {
              stopRefundUser.push(row._source.user_id);
            }
          }
        });
        continueContainer = compareData(continueContainer, stopRefundUser);
        deferred.resolve({ status: result.status, date:selectedDate, continueUser : continueContainer });
      }, deferred.reject);
      return deferred.promise;
    }


    function createQueryString(paymentFilter, startDate, endDate, selectedDevice) {
      var query = 'SELECT * FROM log-*';
      query += createWhereFilterString(paymentFilter, startDate, endDate, selectedDevice);
      return encodeURIComponent(query);
    }
    function createWhereFilterString(paymentFilter, startDate, endDate, selectedDevice) {
      var where = '';
      where += getPaymentFilterClause(paymentFilter);
      where +=getDeviceFilterClause(selectedDevice);
      where += getDateFilterString(paymentFilter, startDate, endDate);
      return where;
    }
    function getPaymentFilterClause(paymentFilter) {
      var payment = ' WHERE _type="payment" AND ';
      if (paymentFilter === 'new') {
        payment += '(event="_null" AND now_payment_plan="_null" AND (change_payment_plan="basic" or change_payment_plan="standard" or change_payment_plan="premium") or event="refund" or event="stop")';
      } else if (paymentFilter === 'continue') {
        payment += '(event="_null" AND now_payment_plan="_null" AND (change_payment_plan="basic" or change_payment_plan="standard" or change_payment_plan="premium") or event="refund" or event="stop")';
      }
      return payment;
    }

    function getDateFilterString(paymentFilter, startDate, endDate) {
      var startDateStr = getTimeStampFromStr(startDate);
      var endDateStr = getTimeStampFromStr(endDate) + dayInMS;
      if (paymentFilter === 'new') {
        return ' AND @timestamp BETWEEN "' + startDateStr + '" AND "' + endDateStr + '"'+' limit 10000';
      } else {
        return ' AND @timestamp<="' + endDateStr + '"' + ' limit 10000';
      }
    }

    function getDeviceFilterClause(deviceFilter) {
      if (deviceFilter === 'android') {
        return ' AND payment_method="iamport"';
      } else if (deviceFilter === 'ios') {
        return ' AND payment_method="app_store"';
      } else {
        return '';
      }
    }

    function getTimeStampFromStr(date) {
      var timestamp = new Date(date).setHours(12, 0, 0, 0);
      return new Date(timestamp).getTime();
    }
    function compareData(firstArray, secondArray) {
      secondArray.forEach(function (item) {
        if (lodash.includes(firstArray, item) === true) {
          firstArray.splice(firstArray.indexOf(item), 1);
        }
      });
      return firstArray;
    }
    function dateMonthSet(number, date) {
      var startDate = new Date(date.getFullYear(), date.getMonth()- number, 1),
          endDate= new Date(date.getFullYear(), date.getMonth() - number + 1, 0);

      return [startDate, endDate];
    }
    function checkTestId(userId) {
      var testList = [1520, 1524, 10304, 10320];
      if (testList.indexOf(userId) === -1) {
        return false;
      } else {
        return true;
      }
    }

  }
  MonthlyPayment.$inject = [
    '$http',
    '$q',
    '$filter',
    'lodash',
    'APP_CONFIG'
  ];
  angular.module('dataDashboard.monthlyPayment.service.MonthlyPayment', []).factory('MonthlyPayment', MonthlyPayment);
}());