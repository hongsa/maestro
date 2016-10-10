(function () {
  'use strict';
  function UserPageFlow($http, $q, APP_CONFIG) {
    return {
      getUserPageFlow: getUserPageFlow,
      getUserInfo: getUserInfo,
      getPaidDate: getPaidDate,
      getDownloadedCount: getDownloadedCount,
      getCompleteCount: getCompleteCount,
      getLastSignAt: getLastSignAt,
      dateRange: {
        startDate: null,
        endDate: null
      }
    };
    function getUserPageFlow(dataContainer, userId, startDate, endDate, alertCb) {
      var deferred = $q.defer();
      var query = createQueryString(userId, startDate, endDate);
      $http({
        url: APP_CONFIG.ELASTIC_SEARCH_SQL + '?sql=' + query,
        method: 'GET',
        headers: { 'Content-Type': undefined }
      }).then(function (result) {
        dataContainer.splice(0);
        if (result.data.timed_out || result.data.hits.hits.length === 0) {
          createEmptyData(dataContainer, userId);
        } else {
          result.data.hits.hits.forEach(function (row) {
            if ((!dataContainer[dataContainer.length - 1] || dataContainer[dataContainer.length - 1].cur_page !== row._source.cur_page && dataContainer[dataContainer.length - 1].prev_page !== row._source.prev_page) && (row._source.cur_page !== '' && row._source.prev_page !== '')) {
              if (!dataContainer[dataContainer.length - 1] || //display date(ng-if)
                dataContainer[dataContainer.length - 1].time.getDate() !== new Date(row.sort[0]).getDate()) {
                dataContainer.push({
                  time: new Date(row.sort[0]),
                  cur_page: null,
                  prev_page: null,
                  user_ip: null,
                  now_payment_plan: null,
                  app_version: null,
                  _type: null
                });
              }
              dataContainer.push({
                time: new Date(row.sort[0]),
                cur_page: row._source.cur_page,
                prev_page: row._source.prev_page,
                user_ip: row._source.ip,
                now_payment_plan: row._source.now_payment_plan,
                app_version: row._source.app_version,
                _type: row._type
              });
            }
          });
        }
        deferred.resolve();
      }, function (error) {
        var errMsg = error.data.error;
        var errSrc;
        if (errMsg.startsWith('IndexMissingException')) {
          errSrc = errMsg.substring(errMsg.indexOf('20'), errMsg.indexOf(']'));
          alertCb('Could not find data on ' + errSrc);
        }
        deferred.reject();
      });
      return deferred.promise;
    }
    function getUserInfo(dataContainer, userId) {
      var deferred = $q.defer();
      var query = '/lc_db_prd/_table/users/' + userId;
      $http({
        url: APP_CONFIG.BACKEND_ADDRESS + query,
        method: 'GET',
        headers: {
          'X-DreamFactory-Application-Name': APP_CONFIG.DSP_API_NAME,
          'X-DreamFactory-Api-Key': APP_CONFIG.DSP_API_KEY
        }
      }).then(function (result) {
        dataContainer.name = result.data.name;
        dataContainer.created_at = new Date(result.data.created_at);
        dataContainer.role = result.data.role;
        deferred.resolve({ name: 'success' });
      }, deferred.reject);
      return deferred.promise;
    }
    function getPaidDate(dataContainer, userId) {
      var deferred = $q.defer();
      var query = 'SELECT * FROM log-* WHERE _type="payment" and event="_null" and user_id=' + userId + ' ORDER BY @timestamp DESC LIMIT 1';
      $http({
        url: APP_CONFIG.ELASTIC_SEARCH_SQL + '?sql=' + query,
        method: 'GET',
        headers: { 'Content-Type': undefined }
      }).then(function (result) {
        if (result.data.hits.hits.length !== 0) {
          dataContainer.paid = result.data.hits.hits[0]._source['@timestamp'];
        } else {
          dataContainer.paid = 'None';
        }
        deferred.resolve({ name: 'success' });
      }, deferred.reject);
      return deferred.promise;
    }
    function getDownloadedCount(dataContainer, userId) {
      var deferred = $q.defer();
      var query = 'SELECT count(distinct card_id) as count FROM log-* WHERE _type="download" and user_id=' + userId;
      $http({
        url: APP_CONFIG.ELASTIC_SEARCH_SQL + '?sql=' + query,
        method: 'GET',
        headers: { 'Content-Type': undefined }
      }).then(function (result) {
        dataContainer.downloadedCount = result.data.aggregations.count.value;
        deferred.resolve({ name: 'success' });
      }, deferred.reject);
      return deferred.promise;
    }
    function getCompleteCount(dataContainer, userId) {
      var deferred = $q.defer();
      var query = 'SELECT count(distinct card_id) as count FROM log-* WHERE _type="result" and user_id=' + userId;
      $http({
        url: APP_CONFIG.ELASTIC_SEARCH_SQL + '?sql=' + query,
        method: 'GET',
        headers: { 'Content-Type': undefined }
      }).then(function (result) {
        dataContainer.completeCount = result.data.aggregations.count.value;
        deferred.resolve({ name: 'success' });
      }, deferred.reject);
      return deferred.promise;
    }
    function getLastSignAt(dataContainer, userId) {
      var deferred = $q.defer();
      var query = 'SELECT * FROM log-* WHERE user_id=' + userId + ' ORDER BY @timestamp DESC LIMIT 1';
      $http({
        url: APP_CONFIG.ELASTIC_SEARCH_SQL + '?sql=' + query,
        method: 'GET',
        headers: { 'Content-Type': undefined }
      }).then(function (result) {
        if (result.data.hits.hits.length !== 0) {
          dataContainer.last_sign_at = result.data.hits.hits[0].sort[0];
        } else {
          dataContainer.paid = 'None';
        }
        deferred.resolve({ name: 'success' });
      }, deferred.reject);
      return deferred.promise;
    }
    function createQueryString(userId, startDate, endDate) {
      var query = 'SELECT * FROM log-*';
      query += createWhereFilterString(userId, startDate, endDate);
      query += ' ORDER BY @timestamp ASC';
      query += createLimitString(startDate, endDate);
      return query;
    }
    function createWhereFilterString(userId, startDate, endDate) {
      var where = ' WHERE';
      where += ' user_id="' + userId + '"';
      where += getDateFilterString(startDate, endDate);
      return where;
    }
    function createLimitString(startDate, endDate) {
      return ' LIMIT 10000';
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
    function getDateFilterString(startDate, endDate) {
      var endDateCopy = new Date(endDate.getTime());
      endDateCopy.setDate(endDateCopy.getDate() + 1);
      var startDateStr = formatDateName(getDateInNumbers(startDate), '-');
      var endDateStr = formatDateName(getDateInNumbers(endDateCopy), '-');
      return ' AND @timestamp BETWEEN "' + startDateStr + '" AND "' + endDateStr + '"';
    }
    function createEmptyData(dataContainer, userId) {
      dataContainer.push({
        time: 'There is no record of user "' + userId + '"',
        prev_page: '-',
        cur_page: '-'
      });
    }
  }
  UserPageFlow.$inject = [
    '$http',
    '$q',
    'APP_CONFIG'
  ];
  angular.module('dataDashboard.userPageFlow.service.UserPageFlow', []).factory('UserPageFlow', UserPageFlow);
}());