(function () {
  'use strict';
  var dayInMS = 86400000;

  function CumulativeUserData($http, $q, $filter, APP_CONFIG) {
    return {
      getCumulativeUserData: getCumulativeUserData,
      getUserProportionData: getUserProportionData
    };

    function getCumulativeUserData(dataContainer, selectedRange, roleFilter, deviceFilter, startDate, endDate) {
      var deferred = $q.defer(),
          query = createQueryString(selectedRange, roleFilter, deviceFilter, startDate, endDate),
          prevValue = 0,
          flag = false;

      $http({
        url: APP_CONFIG.ELASTIC_SEARCH_SQL+ '?sql=' + query,
        method: 'GET',
        headers: {
          'Content-Type': undefined
        },
      }).then(function (result) {

        if (!result.data.timed_out) {
          dataContainer.data.splice(0);

          result.data.aggregations.timestamp.buckets.forEach(function (item, i) {

            if (getTimeStampFromStr(startDate) >= changeWeeklyMonthlyYearlyDate(selectedRange, item.key)) {
              prevValue += item.doc_count;
            } else if (getTimeStampFromStr(startDate) < changeWeeklyMonthlyYearlyDate(selectedRange, item.key)
                && getTimeStampFromStr(endDate) >= changeWeeklyMonthlyYearlyDate(selectedRange, item.key)) {
              dataContainer.data.push([
                changeWeeklyMonthlyYearlyDate(selectedRange, item.key),
                prevValue + (item.doc_count || 0)
              ]);
              prevValue = dataContainer.data[dataContainer.data.length - 1][1];
            }
          });
        }
        deferred.resolve({
          name :'success'
        });
      }, deferred.reject);
      return deferred.promise;
    }

    function changeWeeklyMonthlyYearlyDate(selectedRange, key) {
      if(selectedRange === 'weekly') {
        key += (dayInMS * 6);
        return key
      } else if (selectedRange === 'monthly') {
        var now = new Date(key);
        key = getTimeStampFromStr(new Date(new Date(now).setMonth(now.getMonth()+1))) - dayInMS;
        return key
      } else if (selectedRange === 'yearly') {
        key += (dayInMS * 364);
        return key
      } else {
        return key
      }
    }

    function getUserProportionData(dataContainer, dataSubject, baseCumulativeData, startDate, endDate, currentTotal, type, chart) {
      var deferred = $q.defer(),
          query = 'SELECT count(*) FROM accum-stats-201*' + createPieChartQueryWhereFilter(type) + ' AND' + getDateFilterString(startDate, endDate) + 'GROUP BY ' + dataSubject;
      $http({
        url: APP_CONFIG.ELASTIC_SEARCH_SQL + '?sql=' + query,
        method: 'GET',
        headers: {
          'Content-Type': undefined
        }
      }).then(function (result) {
        dataContainer.splice(0);
        currentTotal.value = 0;

        result.data.aggregations[dataSubject].buckets.forEach(function (row, i) {
          if (getTimeStampFromStr(startDate) <= 1446336000000) {
            dataContainer.push({
              name: (dataSubject === 'country' ? $filter('country')(row.key) : row.key),
              y: (baseCumulativeData[row.key] || 0) + row.doc_count,
              color: APP_CONFIG.COLORS[i % 11]
            });
            currentTotal.value += (baseCumulativeData[row.key] || 0) + row.doc_count;
          }
          else {
            dataContainer.push({
              name: (dataSubject === 'country' ? $filter('country')(row.key) : row.key),
              y: row.doc_count,
              color: APP_CONFIG.COLORS[i % 11]
            });
            currentTotal.value += row.doc_count;
          }
        });
        if (chart) {
          chart.hideLoading();
        }

        deferred.resolve({
          name :'success'
        });
      }, deferred.reject);

      return deferred.promise;
    }

    function getTimeStampFromStr(date) {
      return new Date(date).getTime();
    }

    function createQueryString(selectedRange, roleFilter, deviceFilter, startDate, endDate) {
      var query = 'SELECT count(*) FROM dashboard-2016.*';
      query += createWhereFilterString(roleFilter, deviceFilter, startDate, endDate);
      query += createGroupByString(selectedRange);
      query += createOrderByString();

      return encodeURIComponent(query);
    }

    function createWhereFilterString(roleFilter, deviceFilter, startDate, endDate) {
      var where = ' WHERE code=200 AND method="POST"';

      where += getAPIFilterClause();
      where += getDeviceFilterString(deviceFilter);
      where += getRoleFilterClause(roleFilter);

      return where;
    }

    function getAPIFilterClause() {
      return ' AND (api="users" and api="classting")';
    }

    function createPieChartQueryWhereFilter(typeFilter) {
      var where = '';
      if (typeFilter == 'User Signups') {
        where = ' WHERE _type="user"';
      } else {
        where = ' WHERE _type="user-del"';
      }
      return where;
    }

    function getRoleFilterClause(roleFilter) {
      if (roleFilter === 'teacher') {
        return ' AND role="teacher"';
      } else if (roleFilter === 'student') {
        return ' AND role="student"';
      } else if (roleFilter === 'parent') {
        return ' AND role="parent"';
      } else {
        return '';
      }
    }

    function getDeviceFilterString(deviceFilter) {
      if (deviceFilter === 'android') {
        return ' AND device="android"';
      } else if (deviceFilter === 'ios') {
        return ' AND device="ios"';
      } else if (deviceFilter === 'web') {
        return ' AND device="web"';
      } else {
        return '';
      }
    }

    function getDateFilterString(startDate, endDate) {
      var dayInMS = 86400000,
          startDateStr = getTimeStampFromStr(startDate) - dayInMS,
          endDateStr = getTimeStampFromStr(endDate);
      return ' @timestamp BETWEEN "' + startDateStr + '" AND "' + endDateStr + '"';
    }

      function createGroupByString(selectedRange) {
      if (selectedRange === 'daily') {
        return ' GROUP BY date_histogram("alias"="timestamp", field="@timestamp", "interval"="1d", "format"="yyyy-MM-dd", "time_zone"="+09:00")'
      } else if (selectedRange === 'weekly') {
        return ' GROUP BY date_histogram("alias"="timestamp", field="@timestamp", "interval"="1w", "format"="yyyy-MM-dd", "time_zone"="+09:00")'
      } else if (selectedRange === 'monthly'){
        return ' GROUP BY date_histogram("alias"="timestamp", field="@timestamp", "interval"="1M", "format"="yyyy-MM-dd", "time_zone"="+09:00")'
      } else {
        return ' GROUP BY date_histogram("alias"="timestamp", field="@timestamp", "interval"="1y", "format"="yyyy-MM-dd", "time_zone"="+09:00")'
      }
    }

    function createOrderByString() {
      return ' ORDER BY @timestamp ASC';
    }
  }

  CumulativeUserData.$inject = ['$http', '$q', '$filter', 'APP_CONFIG'];

  angular.module('dataDashboard.cumulativeUserData.service.CumulativeUserData', [])
      .factory('CumulativeUserData', CumulativeUserData);
})();
