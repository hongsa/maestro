(function() {
  'use strict';

  function CustomQuery($http, $q, $filter, APP_CONFIG) {
    return {
      getCustomQueryData: getCustomQueryData,
      createQueryString: createQueryString,
      getGroupByFilterFromQuery: getGroupByFilterFromQuery,
      dateRange: {
        startDate: null,
        endDate: null
      }
    };

    function getCustomQueryData(dataContainer, noCountTableContainer, query, startDate, endDate, chart, lastGroupByAggregation, dataFetched, alertCb, chartTypeCb, axisTypeCb) {
      var deferred = $q.defer(),
          actualQuery = getActualQueryString(query, startDate, endDate);

      if (actualQuery === 'incorrect_from') {
        alertCb('There was an error while parsing your query. Please use "eslog_*" format for FROM clause.');
      } else if (actualQuery === 'forbidden_action') {
        alertCb('Only SELECT query is allowed.');
      } else {
        $http({
          url: APP_CONFIG.ELASTIC_SEARCH_SQL + '?sql=' + actualQuery,
          method: 'GET',
          headers: {
            'Content-Type': undefined
          }
        }).then(function(result) {
          if (actualQuery.indexOf('count(') === -1) {
            // no count
            noCountTableContainer.headers.splice(0);
            noCountTableContainer.data.splice(0);
            noCountTableContainer.slicedData.splice(0);
            noCountTableContainer.visible = true;
            lastGroupByAggregation.value = null;

            if (result.data.timed_out || !result.data.hits || !result.data.hits.hits || result.data.hits.hits.length === 0) {
              noCountTableContainer.headers.push('DATA NOT FOUND');
              noCountTableContainer.data.push({
                'DATA NOT FOUND': 'DATA NOT FOUND'
              });
              dataFetched.value = false;
            } else {
              var headers = Object.keys(result.data.hits.hits[0]._source);
              noCountTableContainer.headers.push.apply(noCountTableContainer.headers, headers);

              result.data.hits.hits.forEach(function(row) {
                noCountTableContainer.data.push(row._source);
              });
              noCountTableContainer.slicedData = noCountTableContainer.data.slice(0, noCountTableContainer.pageSize);
              noCountTableContainer.total = noCountTableContainer.data.length;
              dataFetched.value = true;
            }
          } else {
            // with count
            dataContainer.data.splice(0);
            dataContainer.slicedData.splice(0);
            noCountTableContainer.visible = false;
            var lastDay,
                groupByFilter,
                dayInMS = 86400000;

            if (result.data.timed_out || !result.data.aggregations) {
              createEmptyData(dataContainer, startDate, endDate);
            } else {
              groupByFilter = getGroupByFilterFromQuery(actualQuery, result.data.aggregations);
              lastGroupByAggregation.value = groupByFilter;
              if (groupByFilter === null) {
                alertCb('There was an error while parsing your query. Please use GROUP BY clause properly.');
                deferred.resolve();
                return null;
              }

              if (result.data.aggregations[groupByFilter].buckets) {
                result.data.aggregations[groupByFilter].buckets.forEach(function(row) {
                  if (groupByFilter.indexOf('date_histogram') !== -1) {
                    while (lastDay && (row.key - lastDay) > dayInMS) {
                      dataContainer.data.push([
                        lastDay + dayInMS,
                        0
                      ]);
                      lastDay = lastDay + dayInMS;
                    }
                  }
                  dataContainer.data.push([
                    row.key,
                    row.doc_count
                  ]);
                  lastDay = row.key;
                });
              } else {
                dataContainer.data.push([
                  'count',
                  result.data.aggregations[groupByFilter].value
                ]);
              }

              dataContainer.slicedData = dataContainer.data.slice(0, dataContainer.pageSize);
              dataContainer.total = dataContainer.data.length;
              dataFetched.value = true;
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
          }

          deferred.resolve();
        }, function(error) {
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

    function getGroupByFilterFromQuery(query, aggregations) {
      if (aggregations) {
        return Object.keys(aggregations)[0] || null;
      } else {
        var groupBy = query.substring(query.toLowerCase().indexOf('group by')+9, query.length);
        if (groupBy.startsWith('date_histogram')) {
          return groupBy.replace(/['"]/g, '');
        } else if (groupBy.length > query.length-9) {
          return null;
        } else {
          return groupBy;
        }
      }
    }

    function getActualQueryString(query, startDate, endDate) {
      var actualFrom,
          abstractFrom;

      if (!query.toLowerCase().startsWith('select')) {
        return 'forbidden_action';
      } else if (query.toLowerCase().indexOf('lclog_all') !== -1) {
        abstractFrom = 'lclog_all';
        actualFrom = createFromRangeString(startDate, endDate);
      } else {
        return query.toLowerCase();
      }
      return query.toLowerCase().replace(abstractFrom, actualFrom);
    }

    function createQueryString(logTypeFilter, countRowsFilter, groupByFilter, queryParams, startDate, endDate) {
      var query = '';
      query += createSelectString(countRowsFilter);
      query += createAbstractFromRangeString();
      query += createWhereFilterString(logTypeFilter, queryParams, startDate, endDate);
      query += createGroupByString(groupByFilter);

      return query;
    }

    function createSelectString(countRowsFilter) {
      if (countRowsFilter === 'yes') {
        return 'SELECT count(*)';
      } else {
        return 'SELECT *';
      }
    }

    function createAbstractFromRangeString() {
      return ' FROM lclog_all';
    }

    function createFromRangeString(startDate, endDate) {
      var startDateCopy = new Date(startDate.getTime()),
          endDateNums = getDateInNumbers(endDate),
          devicePrefix = 'log-',
          from = formatDateName(devicePrefix, getDateInNumbers(startDate));

      startDateCopy.setDate(startDateCopy.getDate()+1);
      var currentDate = startDateCopy.getDate(),
          startDateNums = getDateInNumbers(startDateCopy),
          prevDatePosition = getDateInNumbers(startDate).toString().substring(6,7);

      while (startDateNums < endDateNums) {
        if (!prevDatePosition || prevDatePosition !== startDateNums.toString().substring(6,7)) {
          from += (',' + formatDateName(devicePrefix, startDateNums));
          prevDatePosition = startDateNums.toString().substring(6,7);
        }
        startDateCopy.setDate(currentDate + 1);
        currentDate = startDateCopy.getDate();
        startDateNums = getDateInNumbers(startDateCopy);
      }
      if (!prevDatePosition || prevDatePosition !== endDateNums.toString().substring(6,7)) {
        from += (',' + formatDateName(devicePrefix, endDateNums));
      }

      return from;
    }

    function createGroupByString(groupByFilter) {
      if (groupByFilter === 'none') {
        return '';
      } else {
        var groupBy = ' GROUP BY ';
        if (groupByFilter === 'date') {
          groupBy += 'date_histogram(field="@timestamp","interval"="1d")';
        } else {
          groupBy += groupByFilter;
        }

        return groupBy;
      }
    }

    function formatDateName(devicePrefix, dateNums, delimeter) {
      var dateString = dateNums.toString();
      if (delimeter) {
        return devicePrefix + dateString.substring(0,4) + delimeter + dateString.substring(4,6) + delimeter + dateString.substring(6,8);
      } else {
        return devicePrefix + dateString.substring(0,4) + '.' + dateString.substring(4,6) + '*';
      }
    }

    function getDateInNumbers(date) {
      return (date.getFullYear() * 10000) + ((date.getMonth()+1) * 100) + date.getDate();
    }

    function getDeviceFilterString(deviceFilter) {
      if (deviceFilter === 'All') {
        return '';
      } else if (deviceFilter === 'Android') {
        return ' AND app_version="a"';
      } else if (deviceFilter === 'iOS') {
        return ' AND app_version="i"';
      } else {
        return '';
      }
    }

    function getDateFilterString(startDate, endDate) {
      var endDateCopy = new Date(endDate.getTime());
      endDateCopy.setDate(endDateCopy.getDate()+1);

      var startDateStr = formatDateName('', getDateInNumbers(startDate), '-'),
          endDateStr = formatDateName('', getDateInNumbers(endDateCopy), '-');
      return ' AND @timestamp BETWEEN "' + startDateStr + '" AND "' + endDateStr + '"';
    }

    function createWhereFilterString(logTypeFilter, queryParams, startDate, endDate) {
      var where = ' WHERE';

      where += getLogTypeFilterClause(logTypeFilter);
      where += getCodeFilterClause(logTypeFilter);
      where += getAPIFilterClause(queryParams.api);
      where += getRoleFilterClause(queryParams.role);
      where += getRateFilterClause(queryParams.rate);
      where += getCategoryFilterClause(queryParams.category);
      where += getActionFilterClause(queryParams.action);
      where += getCurPageFilterClause(queryParams.cur_page);
      where += getPrevPageFilterClause(queryParams.prev_page);
      where += getViewTypeFilterClause(queryParams.view_type);
      where += getMethodFilterClause(queryParams.method);
      where += getDeviceFilterString(queryParams.device);
      where += getDateFilterString(startDate, endDate);

      return where;
    }

    function getCodeFilterClause(logTypeFilter) {
      if (logTypeFilter === 'serverapi') {
        return ' AND code=200';
      } else {
        return '';
      }
    }

    function getLogTypeFilterClause(logTypeFilter) {
      return ' _type="' + logTypeFilter + '"';
    }

    function getAPIFilterClause(apiFilter) {
      if (apiFilter) {
        return ' AND api="' + apiFilter + '"';
      } else {
        return '';
      }
    }

    function getRoleFilterClause(roleFilter) {
      if (roleFilter === 'All') {
        return '';
      } else if (roleFilter === 'child') {
        return ' AND role="child"';
      } else if (roleFilter === 'parent') {
        return ' AND role="parent"';
      } else {
        return ' AND (role="parent" OR role="child")';
      }
    }

    function getRateFilterClause(rateFilter) {
      if (!rateFilter || rateFilter === 'All') {
        return '';
      } else {
        return ' AND rate=' + '"' + rateFilter + '"';
      }
    }
    function getCategoryFilterClause(categoryFilter) {
      if (!categoryFilter || categoryFilter === 'All') {
        return '';
      } else {
        return ' AND category=' + '"' + categoryFilter + '"';
      }
    }

    function getActionFilterClause(actionFilter) {
      if (!actionFilter || actionFilter === 'All') {
        return '';
      } else {
        return ' AND action=' + '"' + actionFilter + '"';
      }
    }

    function getCurPageFilterClause(pageFilter) {
      if (!pageFilter || pageFilter === 'All') {
        return '';
      } else {
        return ' AND cur_page=' + '"'+ $filter('pageName2')(pageFilter) + '"';
      }
    }
    function getPrevPageFilterClause(pageFilter) {
      if (!pageFilter || pageFilter === 'All') {
        return '';
      } else {
        return ' AND prev_page=' + '"'+ $filter('pageName2')(pageFilter) + '"';
      }
    }
    function getViewTypeFilterClause(viewTypeFilter) {
      if (!viewTypeFilter || viewTypeFilter === 'All') {
        return '';
      } else {
        return ' AND view_type=' + '"'+ viewTypeFilter + '"';
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
        return '';
      }
    }

    function createEmptyData(dataContainer, startDate, endDate) {
      for (var start = startDate.getTime(); start < endDate.getTime(); start+=86400000) {
        dataContainer.data.push([start, 0]);
      }
      dataContainer.data.push([endDate.getTime(), 0]);
    }
  }

  CustomQuery.$inject = ['$http', '$q', '$filter', 'APP_CONFIG'];

  angular.module('dataDashboard.customQuery.service.CustomQuery', [])
    .factory('CustomQuery', CustomQuery);
})();
