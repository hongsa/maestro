(function () {
  'use strict';
  function UserPageFlow($http, $q, APP_CONFIG) {
    return {
      getUserPageFlow: getUserPageFlow,
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
                  user_ip: null
                });
              }
              dataContainer.push({
                time: new Date(row.sort[0]),
                cur_page: row._source.cur_page,
                prev_page: row._source.prev_page,
                user_ip: row._source.ip
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
    function createQueryString(userId, startDate, endDate) {
      var query = 'SELECT ip,api,cur_page,prev_page,@timestamp';
      query += createFromRangeString(startDate, endDate);
      query += createWhereFilterString(userId, startDate, endDate);
      query += ' ORDER BY @timestamp ASC';
      query += createLimitString(startDate, endDate);
      return query;
    }
    function createFromRangeString(startDate, endDate) {
      var startDateCopy = new Date(startDate.getTime());
      var endDateNums = getDateInNumbers(endDate);
      var devicePrefix = 'all_prd-';
      var from = ' FROM ' + formatDateName(devicePrefix, getDateInNumbers(startDate));
      startDateCopy.setDate(startDateCopy.getDate() + 1);
      var currentDate = startDateCopy.getDate();
      var startDateNums = getDateInNumbers(startDateCopy);
      var prevDatePosition = getDateInNumbers(startDate).toString().substring(6, 7);
      while (startDateNums < endDateNums) {
        if (!prevDatePosition || prevDatePosition !== startDateNums.toString().substring(6, 7)) {
          from += ',' + formatDateName(devicePrefix, startDateNums);
          prevDatePosition = startDateNums.toString().substring(6, 7);
        }
        startDateCopy.setDate(currentDate + 1);
        currentDate = startDateCopy.getDate();
        startDateNums = getDateInNumbers(startDateCopy);
      }
      if (!prevDatePosition || prevDatePosition !== endDateNums.toString().substring(6, 7)) {
        from += ',' + formatDateName(devicePrefix, endDateNums);
      }
      return from;
    }
    function createWhereFilterString(userId, startDate, endDate) {
      var where = ' WHERE';
      where += ' id="' + userId + '"';
      where += getDateFilterString(startDate, endDate);
      return where;
    }
    function createLimitString(startDate, endDate) {
      return ' LIMIT 10000';
    }
    function formatDateName(devicePrefix, dateNums, delimeter) {
      var dateString = dateNums.toString();
      if (delimeter) {
        return devicePrefix + dateString.substring(0, 4) + delimeter + dateString.substring(4, 6) + delimeter + dateString.substring(6, 8);
      } else {
        return devicePrefix + dateString.substring(0, 4) + '.' + dateString.substring(4, 6) + '.' + dateString.substring(6, 7) + '*';
      }
    }
    function getDateInNumbers(date) {
      return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    }
    function getDateFilterString(startDate, endDate) {
      var endDateCopy = new Date(endDate.getTime());
      endDateCopy.setDate(endDateCopy.getDate() + 1);
      var startDateStr = formatDateName('', getDateInNumbers(startDate), '-');
      var endDateStr = formatDateName('', getDateInNumbers(endDateCopy), '-');
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