(function () {
  'use strict';
  function DailyStats($http, $q, APP_CONFIG) {
    return {
      getDailyStatsData: getDailyStatsData,
      getRoleProportionData: getRoleProportionData,
      dateRange: {
        startDate: null,
        endDate: null
      }
    };
    function getDailyStatsData(dataContainer, dataSubject, startDate, endDate, deviceFilter, roleFilter, countryFilter, chart) {
      var deferred = $q.defer(), query = createQueryString(dataSubject, startDate, endDate, deviceFilter, roleFilter, countryFilter, 'linechart');
      $http({
        url: APP_CONFIG.ELASTIC_SEARCH_SQL + '?sql=' + query,
        method: 'GET',
        headers: { 'Content-Type': undefined }
      }).then(function (result) {
        dataContainer.data.splice(0);
        var lastDay, dayInMS = 86400000;
        if (result.data.timed_out || !result.data.aggregations) {
          createEmptyData(dataContainer, startDate, endDate);
        } else {
          result.data.aggregations['date_histogram(field=@timestamp,interval=1d)'].buckets.forEach(function (row) {
            while (lastDay && row.key - lastDay > dayInMS) {
              dataContainer.data.push([
                lastDay + dayInMS,
                0
              ]);
              lastDay = lastDay + dayInMS;
            }
            dataContainer.data.push([
              row.key,
              dataSubject === 'visits' ? row.id.buckets.length : row.doc_count
            ]);
            lastDay = row.key;
          });
        }
        if (chart) {
          chart.hideLoading();
        }
        deferred.resolve();
      }, deferred.reject);
      return deferred.promise;
    }
    function getRoleProportionData(dataContainer, dataSubject, startDate, endDate, chart, alertCb) {
      var deferred = $q.defer(), query = createQueryString(dataSubject, startDate, endDate, 'All', 'All', 'All', 'role'), colors = APP_CONFIG.COLORS;
      $http({
        url: APP_CONFIG.ELASTIC_SEARCH_SQL + '?sql=' + query,
        method: 'GET',
        headers: { 'Content-Type': undefined }
      }).then(function (result) {
        dataContainer.splice(0);
        result.data.aggregations.role.buckets.forEach(function (row, i) {
          dataContainer.push({
            name: row.key,
            y: row.doc_count,
            color: colors[i]
          });
        });
        if (chart) {
          chart.hideLoading();
        }
        deferred.resolve();
      }, function (error) {
        var errMsg = error.data.error;
        if (errMsg.reason === 'no such index') {
          alertCb('Could not find data on ' + errMsg.index);
        }
        deferred.reject();
      });
      return deferred.promise;
    }
    function createQueryString(dataSubject, startDate, endDate, deviceFilter, roleFilter, countryFilter, groupByFilter) {
      var query = 'SELECT count(*)';
      query += createFromRangeString(startDate, endDate);
      query += createWhereFilterString(dataSubject, roleFilter, countryFilter, deviceFilter, startDate, endDate);
      query += createGroupByString(groupByFilter, dataSubject);
      return query;
    }
    function createFromRangeString(startDate, endDate) {
      var startDateCopy = new Date(startDate.getTime()), endDateNums = getDateInNumbers(endDate), devicePrefix = 'all_prd-', from = ' FROM ' + formatDateName(devicePrefix, getDateInNumbers(startDate));
      startDateCopy.setDate(startDateCopy.getDate() + 1);
      var currentDate = startDateCopy.getDate(), startDateNums = getDateInNumbers(startDateCopy), prevDatePosition = getDateInNumbers(startDate).toString().substring(6, 7);
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
    function createGroupByString(groupByFilter, dataSubject) {
      var groupBy = ' GROUP BY';
      if (groupByFilter === 'linechart') {
        groupBy += ' date_histogram(field="@timestamp","interval"="1d")';
      } else if (groupByFilter === 'role') {
        groupBy += ' role';
      } else if (groupByFilter === 'country') {
        groupBy += ' country';
      } else {
        return '';
      }
      if (dataSubject === 'visits') {
        groupBy += ', id';
      }
      return groupBy;
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
    function getDeviceFilterString(deviceFilter) {
      if (deviceFilter === 'All') {
        return '';
      } else if (deviceFilter === 'Android') {
        return ' AND device="android.event"';
      } else if (deviceFilter === 'iOS') {
        return ' AND device="ios.event"';
      } else if (deviceFilter === 'Web') {
        return ' AND device="web.event"';
      } else {
        return '';
      }
    }
    function getDateFilterString(startDate, endDate) {
      var endDateCopy = new Date(endDate.getTime());
      endDateCopy.setDate(endDateCopy.getDate() + 1);
      var startDateStr = formatDateName('', getDateInNumbers(startDate), '-'), endDateStr = formatDateName('', getDateInNumbers(endDateCopy), '-');
      return ' AND @timestamp BETWEEN "' + startDateStr + '" AND "' + endDateStr + '"';
    }
    function createWhereFilterString(dataSubject, roleFilter, countryFilter, deviceFilter, startDate, endDate) {
      var where = ' WHERE', method;
      if (dataSubject.startsWith('deleted')) {
        method = 'DELETE';
      } else {
        method = 'POST';
      }
      where += ' code=200';
      if (dataSubject !== 'visits') {
        where += ' AND method="' + method + '"';
        where += getAPIFilterClause(dataSubject);
      }
      where += getRoleFilterClause(roleFilter);
      where += getCountryFilterClause(countryFilter);
      where += getDeviceFilterString(deviceFilter);
      where += getDateFilterString(startDate, endDate);
      return where;
    }
    function getAPIFilterClause(dataSubject) {
      if (dataSubject === 'newUsers' || dataSubject === 'new users') {
        return ' AND (api="users" AND api<>"mobile_device" AND api<>"pincode" AND api<>"email_verification" AND api<>"favorited_classes" AND api<>"mobile_activation")';
      } else if (dataSubject === 'deletedUsers' || dataSubject === 'deleted users') {
        return ' AND (api="users" AND api<>"mobile_device" AND api<>"favorites" AND api<>"waiting_classes" AND api<>"friends_sent" AND api<>"friends" AND api<>"friends_received" AND api<>"favorited_classes" AND api<>"invited_classes")';
      } else if (dataSubject === 'newClasses' || dataSubject === 'new classes') {
        return ' AND (api="classes" AND api<>"noticeboard" AND api<>"topics" AND api<>"administrators" AND api<>"tingboard")';
      } else if (dataSubject === 'deletedClasses' || dataSubject === 'deleted classes') {
        return ' AND (api="classes" AND api<>"members" AND api<>"announcement" AND api<>"member_candidates" AND api<>"ting_received" AND api<>"administrators" AND api<>"topics")';
      } else if (dataSubject === 'newPosts' || dataSubject === 'new posts') {
        return ' AND api="https://www.classting.com/api/posts"';
      } else if (dataSubject === 'visits') {
        return ' AND api="https://www.classting.com/api/sessions"';
      } else {
        return '';
      }
    }
    function getRoleFilterClause(roleFilter) {
      if (roleFilter === 'All') {
        return ' AND (role="teacher" OR role="student" OR role="parent")';
      } else if (roleFilter === 'teacher') {
        return ' AND role="teacher"';
      } else if (roleFilter === 'student') {
        return ' AND role="student"';
      } else if (roleFilter === 'parent') {
        return ' AND role="parent"';
      } else {
        return ' AND (role="teacher" OR role="student" OR role="parent")';
      }
    }
    function getCountryFilterClause(countryFilter) {
      if (countryFilter === 'All') {
        return '';
      } else if (countryFilter === 'Korea') {
        return ' AND country="KR"';
      } else if (countryFilter === 'Japan') {
        return ' AND country="JP"';
      } else if (countryFilter === 'Taiwan') {
        return ' AND country="TW"';
      } else if (countryFilter === 'USA') {
        return ' AND country="US"';
      } else if (countryFilter === 'Canada') {
        return ' AND country="CA"';
      }
    }
    function createEmptyData(dataContainer, startDate, endDate) {
      for (var start = startDate.getTime(); start < endDate.getTime(); start += 86400000) {
        dataContainer.data.push([
          start,
          0
        ]);
      }
      dataContainer.data.push([
        endDate.getTime(),
        0
      ]);
    }
  }
  DailyStats.$inject = [
    '$http',
    '$q',
    'APP_CONFIG'
  ];
  angular.module('dataDashboard.dailyStats.service.DailyStats', []).factory('DailyStats', DailyStats);
}());