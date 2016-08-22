(function () {
  'use strict';
  function ActiveUsers($http, $q, APP_CONFIG) {
    return {
      getDailyActiveUsersData: getDailyActiveUsersData,
      getWeeklyActiveUsersData: getWeeklyActiveUsersData,
      getMonthlyActiveUsersData: getMonthlyActiveUsersData,
      getCsvFileName: getCsvFileName
    };
    function getDailyActiveUsersData(dataContainer, startDate, endDate, deviceFilter, roleFilter, activityCount, reversedContainerCb) {
      var deferred = $q.defer(), query = createQueryString('1d', startDate, endDate, deviceFilter, roleFilter);
      $http({
        url: APP_CONFIG.ELASTIC_SEARCH_SQL + '?sql=' + query,
        method: 'GET',
        headers: { 'Content-Type': undefined }
      }).then(function (result) {
        var lastDay, dayInMS = 86400000;
        if (!result.data.timed_out && result.data.aggregations) {
          dataContainer.data.splice(0);
          result.data.aggregations.timestamp.buckets.forEach(function (dateRow) {
            if (getTimeStampFromStr(startDate) <= dateRow.key) {
              while (lastDay && dateRow.key - lastDay > dayInMS) {
                dataContainer.data.push([
                  lastDay + dayInMS,
                  0
                ]);
                lastDay = lastDay + dayInMS;
              }
              var datePoint = [
                dateRow.key,
                0
              ];
              dateRow.user_id.buckets.forEach(function (idRow) {
                if (idRow.doc_count >= activityCount) {
                  datePoint[1] += 1;
                }
              });
              dataContainer.data.push(datePoint);
              lastDay = dateRow.key;
            }
          });
        }
        if (reversedContainerCb) {
          reversedContainerCb();
        }
        deferred.resolve();
      }, deferred.reject);
      return deferred.promise;
    }
    function getWeeklyActiveUsersData(dataContainer, startDate, endDate, dateArray, deviceFilter, roleFilter, activityCount, reversedContainerCb) {
      var promises = [];
      dataContainer.data.splice(0);
      dateArray.forEach(function (baseDate) {
        var deferred = $q.defer(), beginDate = new Date(baseDate.getTime()), usernames = {};
        beginDate.setDate(beginDate.getDate() - 6);
        var query = createQueryString('1d', beginDate, baseDate, deviceFilter, roleFilter), datePoint = [
            baseDate.getTime(),
            0
          ];
        $http({
          url: APP_CONFIG.ELASTIC_SEARCH_SQL + '?sql=' + query,
          method: 'GET',
          headers: { 'Content-Type': undefined }
        }).then(function (result) {
          if (!result.data.timed_out && result.data.aggregations) {
            result.data.aggregations.timestamp.buckets.forEach(function (dateRow) {
              dateRow.user_id.buckets.forEach(function (idRow) {
                if (!usernames[idRow.key]) {
                  usernames[idRow.key] = 0;
                }
                usernames[idRow.key] += idRow.doc_count;
              });
            });
            Object.keys(usernames).forEach(function (key) {
              if (usernames[key] >= activityCount) {
                datePoint[1] += 1;
              }
            });
          }
          if (reversedContainerCb) {
            reversedContainerCb();
          }
          deferred.resolve();
        }, deferred.reject);
        dataContainer.data.push(datePoint);
        promises.push(deferred.promise);
      });
      return $q.all(promises);
    }
    function getMonthlyActiveUsersData(dataContainer, startDate, endDate, dateArray, deviceFilter, roleFilter, activityCount, reversedContainerCb) {
      var promises = [];
      dataContainer.data.splice(0);
      dateArray.forEach(function (baseDate) {
        var deferred = $q.defer(), beginDate = new Date(baseDate.getTime()), usernames = {};
        beginDate.setDate(beginDate.getDate() - 29);
        if (beginDate < 1464706800000) {
          beginDate = new Date(2016, 5, 1);
        }
        var query = createQueryString('1d', beginDate, baseDate, deviceFilter, roleFilter), datePoint = [
            baseDate.getTime(),
            0
          ];
        $http({
          url: APP_CONFIG.ELASTIC_SEARCH_SQL + '?sql=' + query,
          method: 'GET',
          headers: { 'Content-Type': undefined }
        }).then(function (result) {
          if (!result.data.timed_out && result.data.aggregations) {
            result.data.aggregations.timestamp.buckets.forEach(function (dateRow) {
              dateRow.user_id.buckets.forEach(function (idRow) {
                if (!usernames[idRow.key]) {
                  usernames[idRow.key] = 0;
                }
                usernames[idRow.key] += idRow.doc_count;
              });
            });
            Object.keys(usernames).forEach(function (key) {
              if (usernames[key] >= activityCount) {
                datePoint[1] += 1;
              }
            });
          }
          if (reversedContainerCb) {
            reversedContainerCb();
          }
          deferred.resolve();
        }, deferred.reject);
        dataContainer.data.push(datePoint);
        promises.push(deferred.promise);
      });
      return $q.all(promises);
    }
    function getDateInString(date) {
      return (date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()).toString();
    }
    function createQueryString(interval, startDate, endDate, deviceFilter, roleFilter) {
      var query = 'SELECT count(*)';
      query += createFromRangeString(startDate, endDate);
      query += createWhereFilterString(startDate, endDate, deviceFilter, roleFilter);
      query += createGroupByString(interval);
      return query;
    }
    function createFromRangeString(startDate, endDate) {
      var startDateCopy = new Date(startDate.getTime()), endDateNums = getDateInNumbers(endDate), firstIndex = formatDateName(getDateInNumbers(startDate)), from = ' FROM ' + firstIndex;
      startDateCopy.setDate(startDateCopy.getDate() + 1);
      var currentDate = startDateCopy.getDate(), startDateNums = getDateInNumbers(startDateCopy), prevDatePosition = getDateInNumbers(startDate).toString().substring(6, 7), prevIndex = firstIndex, currentIndex;
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
    function createGroupByString(interval) {
      return ' GROUP BY date_histogram("alias"="timestamp", field="@timestamp","interval"="' + interval + '"), user_id';
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
      var startDateStr = formatDateName(getDateInNumbers(startDate), '-'), endDateStr = formatDateName(getDateInNumbers(endDateCopy), '-');
      return ' @timestamp BETWEEN "' + startDateStr + '" AND "' + endDateStr + '"';
    }
    function createWhereFilterString(startDate, endDate, deviceFilter, roleFilter) {
      var where = ' WHERE';
      //where += ' code=200';
      where += getDateFilterString(startDate, endDate);
      where += getDeviceFilterClause(deviceFilter);
      where += getRoleFilterClause(roleFilter);
      return where;
    }
    function getAPIFilterClause() {
      return ' AND api="sessions"';
    }
    function getRoleFilterClause(roleFilter) {
      if (roleFilter === 'child') {
        return ' AND role="child"';
      } else if (roleFilter === 'parent') {
        return ' AND role="parent"';
      } else {
        return '';
      }
    }
    function getDeviceFilterClause(deviceFilter) {
      if (deviceFilter === 'android') {
        return ' AND app_version="a"';
      } else if (deviceFilter === 'ios') {
        return ' AND app_version="i"';
      } else {
        return '';
      }
    }
    function getCsvFileName(csvOption, startDate, endDate) {
      return csvOption.replace(/ /g, '_').toLowerCase() + '_' + getDateInString(startDate) + '-' + getDateInString(endDate) + '.csv';
    }
    function getTimeStampFromStr(date) {
      return new Date(date).getTime();
    }
  }
  ActiveUsers.$inject = [
    '$http',
    '$q',
    'APP_CONFIG'
  ];
  angular.module('dataDashboard.activeUsers.service.ActiveUsers', []).factory('ActiveUsers', ActiveUsers);
}());