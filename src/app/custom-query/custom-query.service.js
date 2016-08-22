(function () {
  'use strict';
  function CustomQuery($http, $q, APP_CONFIG) {
    return {
      getCustomQueryData: getCustomQueryData,
      createQueryString: createQueryString,
      getGroupByFilterFromQuery: getGroupByFilterFromQuery,
      dateRange: {
        startDate: null,
        endDate: null
      }
    };
    function getCustomQueryData(dataContainer, query, startDate, endDate, chart, alertCb, chartTypeCb, axisTypeCb) {
      var deferred = $q.defer(), actualQuery = getActualQueryString(query, startDate, endDate);
      if (actualQuery === 'incorrect_from') {
        alertCb('There was an error while parsing your query. Please use "eslog_*" format for FROM clause.');
      } else if (actualQuery === 'forbidden_action') {
        alertCb('Only SELECT query is allowed.');
      } else {
        $http({
          url: APP_CONFIG.ELASTIC_SEARCH_SQL + '?sql=' + actualQuery,
          method: 'GET',
          headers: { 'Content-Type': undefined }
        }).then(function (result) {
          dataContainer.data.splice(0);
          var lastDay, groupByFilter, dayInMS = 86400000;
          if (result.data.timed_out || !result.data.aggregations) {
            createEmptyData(dataContainer, startDate, endDate);
          } else {
            groupByFilter = getGroupByFilterFromQuery(query);
            if (groupByFilter === null) {
              alertCb('There was an error while parsing your query. Please use GROUP BY clause properly.');
              deferred.resolve();
              return null;
            }
            result.data.aggregations[groupByFilter].buckets.forEach(function (row) {
              while (lastDay && row.key - lastDay > dayInMS) {
                dataContainer.data.push([
                  lastDay + dayInMS,
                  0
                ]);
                lastDay = lastDay + dayInMS;
              }
              dataContainer.data.push([
                row.key,
                row.doc_count
              ]);
              lastDay = row.key;
            });
          }
          if (axisTypeCb) {
            axisTypeCb();
          }
          if (chartTypeCb) {
            if (groupByFilter.startsWith('date_histogram')) {
              chartTypeCb('line');
            } else {
              chartTypeCb('column');
            }
          }
          if (chart) {
            chart.hideLoading();
          }
          deferred.resolve();
        }, function (error) {
          var errMsg = error.data.error;
          if (error.status === 404 && errMsg.reason === 'no such index') {
            alertCb('Could not find data on ' + errMsg.index);
          } else if (error.status === 500) {
            alertCb('There was an error while parsing your query. Please check your query syntax');
          }
          deferred.reject();
        });
        return deferred.promise;
      }
    }
    function getGroupByFilterFromQuery(query) {
      var groupBy = query.substring(query.toLowerCase().indexOf('group by') + 9, query.length);
      if (groupBy.startsWith('date_histogram')) {
        return groupBy.replace(/['"]/g, '');
      } else if (groupBy.length > query.length - 9) {
        return null;
      } else {
        return groupBy;
      }
    }
    function getActualQueryString(query, startDate, endDate) {
      var actualFrom, abstractFrom;
      if (!query.toLowerCase().startsWith('select')) {
        return 'forbidden_action';
      } else if (query.toLowerCase().indexOf('eslog_all') !== -1) {
        abstractFrom = 'eslog_all';
        actualFrom = createFromRangeString(startDate, endDate);
      } else {
        return query.toLowerCase();
      }
      return query.toLowerCase().replace(abstractFrom, actualFrom);
    }
    function createQueryString(apiFilter, deviceFilter, roleFilter, countryFilter, methodFilter, groupByFilter, startDate, endDate) {
      var query = 'SELECT count(*)';
      query += createAbstractFromRangeString(deviceFilter);
      query += createWhereFilterString(apiFilter, roleFilter, countryFilter, methodFilter, deviceFilter, startDate, endDate);
      query += createGroupByString(groupByFilter);
      return query;
    }
    function createAbstractFromRangeString() {
      return ' FROM eslog_all';
    }
    function createFromRangeString(startDate, endDate) {
      var startDateCopy = new Date(startDate.getTime()), endDateNums = getDateInNumbers(endDate), devicePrefix = 'all_prd-', from = formatDateName(devicePrefix, getDateInNumbers(startDate));
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
    function createGroupByString(groupByFilter) {
      var groupBy = ' GROUP BY';
      if (groupByFilter === 'date') {
        groupBy += ' date_histogram(field="@timestamp","interval"="1d")';
      } else if (groupByFilter === 'role') {
        groupBy += ' role';
      } else if (groupByFilter === 'device') {
        groupBy += ' device';
      } else if (groupByFilter === 'country') {
        groupBy += ' country';
      } else if (groupByFilter === 'method') {
        groupBy += ' method';
      } else {
        groupBy += ' date_histogram(field="@timestamp","interval"="1d")';
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
    function createWhereFilterString(apiFilter, roleFilter, countryFilter, methodFilter, deviceFilter, startDate, endDate) {
      var where = ' WHERE';
      where += ' code=200';
      where += getAPIFilterClause(apiFilter);
      where += getRoleFilterClause(roleFilter);
      where += getCountryFilterClause(countryFilter);
      where += getMethodFilterClause(methodFilter);
      where += getDeviceFilterString(deviceFilter);
      where += getDateFilterString(startDate, endDate);
      return where;
    }
    function getAPIFilterClause(apiFilter) {
      if (apiFilter === 'users') {
        return ' AND api="https://www.classting.com/api/users"';
      } else if (apiFilter === 'classes') {
        return ' AND api="https://www.classting.com/api/classes"';
      } else if (apiFilter === 'posts') {
        return ' AND api="https://www.classting.com/api/posts"';
      } else if (apiFilter === 'sessions') {
        return ' AND api="https://www.classting.com/api/sessions"';
      } else if (apiFilter === 'notices') {
        return ' AND api="https://www.classting.com/api/notices"';
      } else if (apiFilter === 'photos') {
        return ' AND api="https://www.classting.com/api/photos"';
      } else if (apiFilter === 'albums') {
        return ' AND api="https://www.classting.com/api/albums"';
      } else if (apiFilter === 'search') {
        return ' AND api="https://www.classting.com/api/search"';
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
    function getMethodFilterClause(methodFilter) {
      if (methodFilter === 'POST') {
        return ' AND method="POST"';
      } else if (methodFilter === 'GET') {
        return ' AND method="GET"';
      } else if (methodFilter === 'PUT') {
        return ' AND method="PUT"';
      } else if (methodFilter === 'DELETE') {
        return ' AND method="DELETE"';
      } else {
        return ' AND method="POST"';
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
  CustomQuery.$inject = [
    '$http',
    '$q',
    'APP_CONFIG'
  ];
  angular.module('dataDashboard.customQuery.service.CustomQuery', []).factory('CustomQuery', CustomQuery);
}());