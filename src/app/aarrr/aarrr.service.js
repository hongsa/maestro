(function () {
  'use strict';
  function AARRR($http, $q, $rootScope, $filter, APP_CONFIG, lodash) {
    return {
      getSignUpUser: getSignUpUser,
      getDownloadUser: getDownloadUser,
      getResultUser: getResultUser,
      getActiveUser: getActiveUser,
      getPaymentUser: getPaymentUser
    };
    function getSignUpUser(dataSignUpContainer, startDate, endDate) {
      var deferred = $q.defer();
      var query = '/lc_db_prd/_table/users?fields=id%2C%20name%2C%20created_at&filter=(created_at>=' + getDateToStr(startDate) + ') AND (created_at<=' + getDateToStr(endDate, 'dsp') + ')&include_count=true&continue=true';
      $http({
        url: APP_CONFIG.BACKEND_ADDRESS + query,
        method: 'GET',
        headers: {
          'X-DreamFactory-Application-Name': APP_CONFIG.DSP_API_NAME,
          'X-DreamFactory-Api-Key': APP_CONFIG.DSP_API_KEY
        }
      }).then(function (result) {
        dataSignUpContainer.splice(0);
        result.data.resource.forEach(function (row) {
          dataSignUpContainer.push(row.id);
        });
        deferred.resolve({ status: result.status });
      }, deferred.reject);
      return deferred.promise;
    }
    function getDownloadUser(dataDownloadContainer, dataSignUpContainer, signUpToDownload, startDate, endDate) {
      var deferred = $q.defer();
      var query = 'SELECT distinct user_id' + createFromRangeString(startDate, endDate) + ' WHERE _type="download" and @timestamp Between ' + '"' + getDateToStr(startDate, 'esStart') + '"' + ' AND ' + '"' + getDateToStr(endDate, 'esEnd') + '" limit 10000';
      $http({
        url: APP_CONFIG.ELASTIC_SEARCH_SQL + '?sql=' + query,
        method: 'GET',
        headers: { 'Content-Type': undefined }
      }).then(function (result) {
        dataDownloadContainer.splice(0);
        if (!result.data.timed_out && result.data.hits) {
          result.data.hits.hits.forEach(function (row) {
            dataDownloadContainer.push(row._source.user_id);
          });
        }
        compareData(dataSignUpContainer, dataDownloadContainer, signUpToDownload);
        deferred.resolve({ status: result.status });
      }, deferred.reject);
      return deferred.promise;
    }
    function getResultUser(dataResultContainer, signUpToDownload, downloadToResult, startDate, endDate) {
      var deferred = $q.defer();
      var query = 'SELECT distinct user_id' + createFromRangeString(startDate, endDate) + ' WHERE _type="result" and @timestamp Between ' + '"' + getDateToStr(startDate, 'esStart') + '"' + ' AND ' + '"' + getDateToStr(endDate, 'esEnd') + '" limit 10000';
      $http({
        url: APP_CONFIG.ELASTIC_SEARCH_SQL + '?sql=' + query,
        method: 'GET',
        headers: { 'Content-Type': undefined }
      }).then(function (result) {
        dataResultContainer.splice(0);
        if (!result.data.timed_out && result.data.hits) {
          result.data.hits.hits.forEach(function (row) {
            dataResultContainer.push(row._source.user_id);
          });
        }
        compareData(signUpToDownload, dataResultContainer, downloadToResult);
        deferred.resolve({ status: result.status });
      }, deferred.reject);
      return deferred.promise;
    }
    function getActiveUser(dataActiveContainer, downloadToResult, resultToActive, startDate, endDate) {
      var deferred = $q.defer();
      var query = 'SELECT count(user_id) as count' + createFromRangeString(startDate, endDate) + ' WHERE _type="page" and cur_page="today" and @timestamp Between ' + '"' + getDateToStr(startDate, 'esStart') + '"' + ' AND ' + '"' + getDateToStr(endDate, 'esEnd') + '" group by date_histogram("alias"="timestamp", field="@timestamp","interval"="1d"), user_id limit 10000',
          tmp = {};
      $http({
        url: APP_CONFIG.ELASTIC_SEARCH_SQL + '?sql=' + query,
        method: 'GET',
        headers: { 'Content-Type': undefined }
      }).then(function (result) {
        dataActiveContainer.splice(0);
        result.data.aggregations.timestamp.buckets.forEach(function (dateRow) {
            dateRow.user_id.buckets.forEach(function (idRow) {
              if (tmp.hasOwnProperty(idRow.key)) {
                tmp[idRow.key] += 1;
              } else {
                tmp[idRow.key] = 1;
              }
            });
        });
        for (var id in tmp) {
          if (tmp[id] >= 3) {
            dataActiveContainer.push(parseInt(id));
          }
        }
        compareData(downloadToResult, dataActiveContainer, resultToActive);
        deferred.resolve({ status: result.status });
      }, deferred.reject);
      return deferred.promise;
    }
    function getPaymentUser(dataPaymentContainer, resultToActive, activeToPayment, startDate, endDate) {
      var deferred = $q.defer();
      var query = 'SELECT count(user_id) as count' + createFromRangeString(startDate, endDate) + ' WHERE _type="payment" and event="_null" and @timestamp Between ' + '"' + getDateToStr(startDate, 'esStart') + '"' + ' AND ' + '"' + getDateToStr(endDate, 'esEnd') + '" group by user_id limit 10000';
      $http({
        url: APP_CONFIG.ELASTIC_SEARCH_SQL + '?sql=' + query,
        method: 'GET',
        headers: { 'Content-Type': undefined }
      }).then(function (result) {
        dataPaymentContainer.splice(0);
        if (!result.data.timed_out && result.data.aggregations) {
          result.data.aggregations.user_id.buckets.forEach(function (row) {
            dataPaymentContainer.push(row.key);
          });
        }
        compareData(resultToActive, dataPaymentContainer, activeToPayment);
        deferred.resolve({ status: result.status });
      }, deferred.reject);
      return deferred.promise;
    }
    function createFromRangeString(startDate, endDate) {
      var startDateCopy = new Date(startDate.getTime());
      var endDateNums = getDateInNumbers(endDate);
      var firstIndex = formatDateName(getDateInNumbers(startDate));
      var from = ' FROM ' + firstIndex;
      startDateCopy.setDate(startDateCopy.getDate() + 1);
      var currentDate = startDateCopy.getDate();
      var startDateNums = getDateInNumbers(startDateCopy);
      var prevDatePosition = getDateInNumbers(startDate).toString().substring(6, 7);
      var prevIndex = firstIndex;
      var currentIndex;
      while (startDateNums < endDateNums) {
        currentIndex = formatDateName(startDateNums);
        if (prevIndex !== currentIndex) {
          from += ',' + formatDateName(startDateNums);
          prevDatePosition = startDateNums.toString().substring(6, 7);
        }
        startDateCopy.setDate(currentDate + 1);
        currentDate = startDateCopy.getDate();
        startDateNums = getDateInNumbers(startDateCopy);
        prevIndex = currentIndex;
      }
      currentIndex = formatDateName(startDateNums);
      if (prevIndex !== currentIndex) {
        from += ',' + formatDateName(endDateNums);
      }
      return from;
    }
    function formatDateName(dateNums, delimeter) {
      var dateString = dateNums.toString();
      if (delimeter) {
        return dateString.substring(0, 4) + delimeter + dateString.substring(4, 6) + delimeter + dateString.substring(6, 8);
      } else {
        return 'log-' + dateString.substring(0, 4) + '.' + dateString.substring(4, 6);  //return 'stg-' + dateString.substring(0,4)
      }
    }
    function getDateInNumbers(date) {
      return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    }
    function getDateToStr(date, type) {
      var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '',
          year = d.getFullYear(),
          time = '';

      if (type === 'dsp') {
        day = '' + (d.getDate() + 1);
      } else {
        day = '' + d.getDate();
      }

      if (type === 'esStart') {
        time = 'T00:00:00';
      } else if (type === 'esEnd') {
        time = 'T23:59:59';
      }

      if (month.length < 2) {
        month = '0' + month;
      }
      if (day.length < 2) {
        day = '0' + day;
      }
      return [
        year,
        month,
        day
      ].join('-') + time;
    }
    function compareData(firstArray, secondArray, resultArray) {
      resultArray.splice(0);
      firstArray.forEach(function (item) {
        if (lodash.includes(secondArray, item) === true) {
          resultArray.push(item);
        }
      });
    }
  }
  AARRR.$inject = [
    '$http',
    '$q',
    '$rootScope',
    '$filter',
    'APP_CONFIG',
    'lodash'
  ];
  angular.module('dataDashboard.aarrr.service.AARRR', []).factory('AARRR', AARRR);
}());