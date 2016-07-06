(function () {
  'use strict';

  function MonthlyRecurringRevenue($http, $q, $filter, APP_CONFIG) {
    return {
      getMonthlyRecurringRevenue: getMonthlyRecurringRevenue,
    };

    function getMonthlyRecurringRevenue(baseCumulativeData, lineChartDataContainer, selectedFilter, selectedRange, roleFilter, deviceFilter, countryFilter, languageFilter, currentTotal, reversedContainerCb, startDate, endDate) {
      var deferred = $q.defer(),
          query = createQueryString(roleFilter, deviceFilter, countryFilter, languageFilter, selectedRange, lineChartDataContainer.name, startDate, endDate),
          prevValue = 0,
          flag = false;

      $http({
        url: APP_CONFIG.NEW_ELASTIC_SEARCH_SQL+ '?sql=' + query,
        method: 'GET',
        headers: {
          'Content-Type': undefined
        },
      }).then(function (result) {

        if (!result.data.timed_out) {
          lineChartDataContainer.data.splice(0);
          currentTotal.value = 0;
          currentTotal.first = 0;

          result.data.aggregations.timestamp.buckets.forEach(function (item, i) {
            if (i === 0) {
              prevValue = (baseCumulativeData[selectedFilter] || 0);
            }
            if (getTimeStampFromStr(startDate) - 86400000 >= changeWeeklyMonthlyYearlyDate(selectedRange, item.key)) {
              prevValue += item.doc_count
            } else if (getTimeStampFromStr(startDate) - 86400000  < changeWeeklyMonthlyYearlyDate(selectedRange, item.key)
                && getTimeStampFromStr(endDate) - 86400000 >= changeWeeklyMonthlyYearlyDate(selectedRange, item.key)) {
              lineChartDataContainer.data.push([
                changeWeeklyMonthlyYearlyDate(selectedRange, item.key),
                prevValue + (item.doc_count || 0)
              ]);
              prevValue = lineChartDataContainer.data[lineChartDataContainer.data.length - 1][1];
              if (flag === false) {
                currentTotal.first = item.doc_count;
              }
              flag = true;
            }
          });

          if (lineChartDataContainer.data.length !== 0) {
            currentTotal.value = lineChartDataContainer.data[lineChartDataContainer.data.length-1][1];
          }
          if (reversedContainerCb) {
            reversedContainerCb();
          }
        }
        deferred.resolve({
          name :'success'
        });
      }, deferred.reject);
      return deferred.promise;
    }


    function changeWeeklyMonthlyYearlyDate(selectedRange, key) {
      if(selectedRange === 'weekly') {
        key += (86400000 * 6);
        return key
      } else if (selectedRange === 'monthly') {
        var now = new Date(key);
        key = getTimeStampFromStr(new Date(new Date(now).setMonth(now.getMonth()+1))) - 86400000;
        return key
      } else if (selectedRange === 'yearly') {
        key += (86400000 * 364);
        return key
      } else {
        return key
      }
    }

    function getTimeStampFromStr(date) {
      return new Date(date).getTime();
    }

    function createQueryString(roleFilter, deviceFilter, countryFilter, languageFilter, selectedRange, typeFilter, startDate, endDate) {
      var query = 'SELECT count(*) FROM accum-stats-201*';
      query += createWhereFilterString(roleFilter, deviceFilter, countryFilter, languageFilter, typeFilter, startDate, endDate);
      query += createGroupByString(selectedRange);
      query += createOrderByString();

      return encodeURIComponent(query);
    }

    function createWhereFilterString(roleFilter, deviceFilter, countryFilter, languageFilter, typeFilter, startDate, endDate) {
      var where = '';
      if (typeFilter === 'User Signups') {
        where = ' WHERE _type="user"';
      } else {
        where = ' WHERE _type="user-del"';
      }

      where += getRoleFilterClause(roleFilter);
      where += getCountryFilterClause(countryFilter);
      where += getDeviceFilterString(deviceFilter);
      where += getLanguageFilterClause(languageFilter);
      //where += ' AND' + getDateFilterString(startDate, endDate);

      return where;
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

    function getCountryFilterClause(countryFilter) {
      if (countryFilter && countryFilter !== 'all') {
        return ' AND country="' + countryFilter + '"';
      } else {
        return '';
      }
    }

    function getLanguageFilterClause(languageFilter) {
      if (languageFilter && languageFilter !== 'all') {
        return ' AND lang="' + languageFilter + '"';
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
      return ' ORDER BY date ASC';
    }
  }

  MonthlyRecurringRevenue.$inject = ['$http', '$q', '$filter', 'APP_CONFIG'];

  angular.module('dataDashboard.monthlyRecurringRevenue.service.MonthlyRecurringRevenue', [])
      .factory('MonthlyRecurringRevenue', MonthlyRecurringRevenue);
})();
