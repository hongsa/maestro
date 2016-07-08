(function () {
  'use strict';
  var dayInMS = 86400000,
      dayInMSHalf = 43200000,
      today = new Date();

  function MonthlyRecurringRevenue($http, $q, $filter, APP_CONFIG) {
    return {
      getMRR: getMRR
    };

    function getMRR(dataContainer, paymentTypeLoop, selectedRange, deviceFilter, startDate, endDate) {
      var promises = [],
          keyList = [];
      dataContainer.data.splice(0);

      paymentTypeLoop.forEach(function (paymentType) {
        var deferred = $q.defer(),
            query = createQueryString(dataContainer.id, paymentType, deviceFilter, selectedRange, startDate, endDate),
            checkType;

      if(dataContainer.id === 'income') {
        checkType = 1;
      } else {
        checkType = -1;
      }

      $http({
        url: APP_CONFIG.ELASTIC_SEARCH_SQL+ '?sql=' + query,
        method: 'GET',
        headers: {
          'Content-Type': undefined
        },
      }).then(function (result) {
        if (!result.data.timed_out) {
          result.data.aggregations.timestamp.buckets.forEach(function (row) {

            if (keyList.indexOf(row.key) === -1) {
              var idx = 0,
                  flag = false;
              for (var i = 0; i < keyList.length; i++) {
                if (keyList[i] > row.key) {
                  idx = i;
                  dataContainer.data.splice(idx,  0, [
                        row.key + dayInMSHalf,
                        row.doc_count * paymentType[2] * checkType
                  ]);
                  flag = true;
                  break
                }
              }
              if (flag === false) {
                dataContainer.data.push([
                  row.key + dayInMSHalf,
                  row.doc_count * paymentType[2] * checkType
                ])
              }
              keyList.push(row.key);
              keyList.sort(sortNumber)
            } else {
              dataContainer.data[keyList.indexOf(row.key)][1] += (row.doc_count * paymentType[2] * checkType)
            }
          });
        }
        deferred.resolve({
          name :'success'
        });
      }, deferred.reject);

      promises.push(deferred.promise);
      });
      return $q.all(promises)
    }


    function getTimeStampFromStr(date) {
      return new Date(date).getTime();
    }

    function sortNumber(a,b) {
      return a - b;
    }


    function createQueryString(dataId, paymentType, deviceFilter, selectedRange, startDate, endDate) {
      var query = 'SELECT count(*) FROM dashboard-2016.*';
      query += createWhereFilterString(dataId, paymentType, deviceFilter, startDate, endDate);
      query += createGroupByString(selectedRange);
      query += createOrderByString();

      return encodeURIComponent(query);
    }

    function createWhereFilterString(dataId, paymentType, deviceFilter, startDate, endDate) {
      var where = '';

      where += getPaymentFilterClause(dataId, paymentType);
      where += getDeviceFilterString(deviceFilter);
      where +=  getDateFilterString(startDate, endDate);

      return where;
    }

    function getPaymentFilterClause(dataId, paymentType) {
      var payment;

      if (dataId === 'income') {
        payment = ' WHERE now_payment=' + '"' + paymentType[0] + '"' + ' AND change_payment=' + '"'  + paymentType[1] + '"';
      } else {
        payment = ' WHERE now_payment=' + '"' + paymentType[1] + '"' + ' AND change_payment=' + '"'  + paymentType[0] + '"';
      }
      return payment
    }

    function getDeviceFilterString(deviceFilter) {
      var device;

      if (deviceFilter === 'android') {
        device =  ' AND app_version="a"';
      } else if (deviceFilter === 'ios') {
        device =  ' AND app_version="i"';
      } else {
        device =  '';
      }
      return device
    }

    function getDateFilterString(startDate, endDate) {
      var dayInMS = 86400000,
          startDateStr = getTimeStampFromStr(startDate) - dayInMS,
          endDateStr = getTimeStampFromStr(endDate);
      return ' AND @timestamp BETWEEN "' + startDateStr + '" AND "' + endDateStr + '"';
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

  MonthlyRecurringRevenue.$inject = ['$http', '$q', '$filter', 'APP_CONFIG'];

  angular.module('dataDashboard.monthlyRecurringRevenue.service.MonthlyRecurringRevenue', [])
      .factory('MonthlyRecurringRevenue', MonthlyRecurringRevenue);
})();
