(function () {
  'use strict';
  var dayInMS = 86400000;
  var dayInMSHalf = 43200000;
  var today = new Date();
  function SubscribeUserData($http, $q, $filter, lodash, APP_CONFIG) {
    return {
      getSubscribeData: getSubscribeData,
      getNewUserList: getNewUserList,
      getAndroidPayment: getAndroidPayment,
      getIosPayment: getIosPayment
    };
    function getSubscribeData(dataContainer, selectedRange, roleFilter, deviceFilter, startDate, endDate) {
      var deferred = $q.defer();
      var query = createQueryString(dataContainer.id, roleFilter, deviceFilter, selectedRange, startDate, endDate);
      $http({
        url: APP_CONFIG.ELASTIC_SEARCH_SQL + '?sql=' + query,
        method: 'GET',
        headers: { 'Content-Type': undefined }
      }).then(function (result) {
        dataContainer.data.splice(0);
        result.data.aggregations.timestamp.buckets.forEach(function (row) {
          var key;
          key = getKey(row.key, selectedRange);
          dataContainer.data.push([
            key,
            row.doc_count
          ]);
        });
        deferred.resolve({ status: result.status });
      }, deferred.reject);
      return deferred.promise;
    }

    function getNewUserList(endDate) {
      var deferred = $q.defer();
      var query = 'SELECT * FROM log-*' + ' WHERE _type="payment" and event="_null" AND now_payment_plan="_null" and @timestamp<=' + '"' + getTimeStampFromStr(endDate) + '"';
      var newUserList = [];
      newUserList.basic = {};
      newUserList.standard = {},
      newUserList.premium = {};
      $http({
        url: APP_CONFIG.ELASTIC_SEARCH_SQL + '?sql=' + query,
        method: 'GET',
        headers: { 'Content-Type': undefined }
      }).then(function (result) {
        result.data.hits.hits.forEach(function (row) {
          if (row._source.change_payment_plan === 'basic') {
            newUserList.basic[row._source.user_id] = getMonth(row._source['@timestamp']);
          } else if (row._source.change_payment_plan === 'standard') {
            newUserList.standard[row._source.user_id] = getMonth(row._source['@timestamp']);
          } else if (row._source.change_payment_plan === 'premium') {
            newUserList.premium[row._source.user_id] = getMonth(row._source['@timestamp']);
          }
        });
        deferred.resolve({ status: result.status, data:newUserList });
      }, deferred.reject);
      return deferred.promise;
    }

    function getAndroidPayment(newUserList, selectedRange, startDate, endDate) {
      var deferred = $q.defer();
      var query = '/lc_db_prd/_table/iamport_receipts?fields=buyer_name%2Cname%2C%20created_at&filter=(status%3D%22paid%22)%20and%20(created_at>=' + getDateToStr(startDate) + ') AND (created_at<=' + getDateToStr(endDate) + ')',
          dateTmp = {};
      dateTmp.basic = {};
      dateTmp.standard = {};
      dateTmp.premium = {};
      $http({
        url: APP_CONFIG.BACKEND_ADDRESS + query,
        method: 'GET',
        headers: {
          'X-DreamFactory-Application-Name': APP_CONFIG.DSP_API_NAME,
          'X-DreamFactory-Api-Key': APP_CONFIG.DSP_API_KEY
        }
      }).then(function (result) {
        result.data.resource.forEach(function (row) {
          var key;
          key = getKey(new Date(row.created_at).getTime(), selectedRange);
          if (lodash.includes(row.name, 'basic') === true && newUserList.basic[getuserId(row.buyer_name)] < getMonth(row.created_at))  {
            if (dateTmp.basic.hasOwnProperty(key) !== true) {
              dateTmp.basic[key] = 1;
            } else {
              dateTmp.basic[key] += 1;
            }
          } else if (lodash.includes(row.name, 'standard') === true && newUserList.standard[getuserId(row.buyer_name)] < getMonth(row.created_at)) {
            if (dateTmp.standard.hasOwnProperty(key) !== true) {
              dateTmp.standard[key] = 1;
            } else {
              dateTmp.standard[key] += 1;
            }
          } else if (lodash.includes(row.name, 'premium') === true && newUserList.premium[getuserId(row.buyer_name)] < getMonth(row.created_at)) {
            if (dateTmp.premium.hasOwnProperty(key) !== true) {
              dateTmp.premium[key] = 1;
            } else {
              dateTmp.premium[key] += 1;
            }
          }
          //else {
          //  console.log(row.buyer_name, getuserId(row.buyer_name), newUserList.basic[getuserId(row.buyer_name)], newUserList.standard[getuserId(row.buyer_name)], newUserList.premium[getuserId(row.buyer_name)], getMonth(row.created_at))
          //}
        });
        //console.log(dateTmp)
        deferred.resolve({ status: result.status,  data: dateTmp});
      }, deferred.reject);
      return deferred.promise;
    }

    function getIosPayment(newUserList, dateTmp, basicSubscribersDataForLineChart, standardSubscribersDataForLineChart, premiumSubscribersDataForLineChart, selectedRange, startDate, endDate) {
      var deferred = $q.defer();
      var query = '/lc_db_prd/_proc/app_store_payment';
      $http({
        url: APP_CONFIG.BACKEND_ADDRESS + query,
        method: 'GET',
        headers: {
          'X-DreamFactory-Application-Name': APP_CONFIG.DSP_API_NAME,
          'X-DreamFactory-Api-Key': APP_CONFIG.DSP_API_KEY
        }
      }).then(function (result) {
        result.data.forEach(function (row) {
          var key;
          key = getKey(new Date(row.created_at).getTime(), selectedRange);
            if (getTimeStampFromStr(startDate) <= key && getTimeStampFromStr(endDate) >= key) {
              //console.log(row.user_id, row.parent_id, (newUserList.basic[row.user_id] !== undefined) ? newUserList.basic[row.user_id]: newUserList.basic[row.parent_id], getMonth(row.created_at))
              //console.log(row.user_id, row.parent_id, (newUserList.standard[row.user_id] !== undefined) ? newUserList.standard[row.user_id]: newUserList.standard[row.parent_id], getMonth(row.created_at))
              //console.log(row.user_id, row.parent_id, (newUserList.premium[row.user_id] !== undefined) ? newUserList.premium[row.user_id]: newUserList.premium[row.parent_id], getMonth(row.created_at))
              if (lodash.includes(row.product_id, 'basic') === true && (newUserList.basic[row.user_id] !== undefined) ? newUserList.basic[row.user_id]: newUserList.basic[row.parent_id] < getMonth(row.created_at))  {
                if (dateTmp.basic.hasOwnProperty(key) !== true) {
                  dateTmp.basic[key] = 1;
                } else {
                  dateTmp.basic[key] += 1;
                }
              } else if (lodash.includes(row.product_id, 'standard') === true && (newUserList.standard[row.user_id] !== undefined) ? newUserList.standard[row.user_id]: newUserList.standard[row.parent_id] < getMonth(row.created_at)) {
                if (dateTmp.standard.hasOwnProperty(key) !== true) {
                  dateTmp.standard[key] = 1;
                } else {
                  dateTmp.standard[key] += 1;
                }
              } else if ((lodash.includes(row.product_id, 'premium') === true && (newUserList.premium[row.user_id] !== undefined) ? newUserList.premium[row.user_id]: newUserList.premium[row.parent_id] < getMonth(row.created_at))) {
                if (dateTmp.premium.hasOwnProperty(key) !== true) {
                  dateTmp.premium[key] = 1;
                } else {
                  dateTmp.premium[key] += 1;
                }
              }
          }
        });
        basicSubscribersDataForLineChart.data = getLineChartData(dateTmp.basic);
        standardSubscribersDataForLineChart.data = getLineChartData(dateTmp.standard);
        premiumSubscribersDataForLineChart.data = getLineChartData(dateTmp.premium);
        deferred.resolve({ status: result.status });
      }, deferred.reject);
      return deferred.promise;

    }

    function getTimeStampFromStr(date) {
      return new Date(date).getTime();
    }
    function getKey(key, selectedRange) {
      var calculateKey;
      if (selectedRange === 'daily') {
        calculateKey = key;
      } else if (selectedRange === 'weekly') {
        calculateKey = key + (6 * dayInMS);
      } else if (selectedRange === 'monthly') {
        calculateKey = new Date(new Date(key).getFullYear(), new Date(key).getMonth() + 1, 0, 0, 0, 0, 0);
        calculateKey = new Date(calculateKey).getTime();
      } else {
        calculateKey = key * (364 * dayInMS);
      }
      if (calculateKey > today) {
        calculateKey = today.setHours(0, 0, 0, 0);
      }
      return new Date(calculateKey).setHours(0,0,0,0) + dayInMSHalf;
    }
    function createQueryString(paymentFilter, roleFilter, deviceFilter, selectedRange, startDate, endDate) {
      var query = 'SELECT count(*) FROM log-*';
      query += createWhereFilterString(paymentFilter, roleFilter, deviceFilter, startDate, endDate);
      query += createGroupByString(selectedRange);
      query += createOrderByString();
      return encodeURIComponent(query);
    }
    function createWhereFilterString(paymentFilter, roleFilter, deviceFilter, startDate, endDate) {
      var where = '';
      where += getPaymentFilterClause(paymentFilter);
      where += getRoleFilterClause(roleFilter);
      where += getDeviceFilterString(deviceFilter);
      where += getDateFilterString(startDate, endDate);
      return where;
    }
    function getPaymentFilterClause(paymentFilter) {
      var payment;
      if (paymentFilter === 'trial-basic') {
        payment = ' WHERE (user_id <> "30" AND user_id <> "1475" AND user_id <> "1520") AND event="_null" AND now_payment_plan="_null" AND change_payment_plan="basic"';
      } else if (paymentFilter === 'trial-standard') {
        payment = ' WHERE (user_id <> "30" AND user_id <> "1475" AND user_id <> "1520") AND event="_null" AND now_payment_plan="_null" AND change_payment_plan="standard"';
      } else if (paymentFilter === 'trial-premium') {
        payment = ' WHERE (user_id <> "30" AND user_id <> "1475" AND user_id <> "1520") AND event="_null" AND now_payment_plan="_null" AND change_payment_plan="premium"';
      }
      return payment;
    }
    function getRoleFilterClause(roleFilter) {
      var role;
      if (roleFilter === 'teacher') {
        role = ' AND role="teacher"';
      } else if (roleFilter === 'student') {
        role = ' AND role="student"';
      } else if (roleFilter === 'parent') {
        role = ' AND role="parent"';
      } else {
        role = '';
      }
      return role;
    }
    function getDeviceFilterString(deviceFilter) {
      var device;
      if (deviceFilter === 'android') {
        device = ' AND payment_method="iamport"';
      } else if (deviceFilter === 'ios') {
        device = ' AND payment_method="app_store"';
      } else {
        device = '';
      }
      return device;
    }
    function getDateFilterString(startDate, endDate) {
      var startDateStr = getTimeStampFromStr(startDate);
      var endDateStr = getTimeStampFromStr(endDate) + dayInMS;
      return ' AND @timestamp BETWEEN "' + startDateStr + '" AND "' + endDateStr + '"';
    }
    function createGroupByString(selectedRange) {
      var groupBy;
      if (selectedRange === 'daily') {
        groupBy = ' GROUP BY date_histogram("alias"="timestamp", field="@timestamp", "interval"="1d", "format"="yyyy-MM-dd", "time_zone"="+09:00")';
      } else if (selectedRange === 'weekly') {
        groupBy = ' GROUP BY date_histogram("alias"="timestamp", field="@timestamp", "interval"="1w", "format"="yyyy-MM-dd", "time_zone"="+09:00")';
      } else if (selectedRange === 'monthly') {
        groupBy = ' GROUP BY date_histogram("alias"="timestamp", field="@timestamp", "interval"="1M", "format"="yyyy-MM-dd", "time_zone"="+09:00")';
      } else {
        groupBy = ' GROUP BY date_histogram("alias"="timestamp", field="@timestamp", "interval"="1y", "format"="yyyy-MM-dd", "time_zone"="+09:00")';
      }
      return groupBy;
    }
    function createOrderByString() {
      return ' ORDER BY @timestamp ASC';
    }
    function getDateToStr(date) {
      var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + (d.getDate() + 1),
          year = d.getFullYear(),
          time = '';

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
    function getMonth(date) {
      return new Date(date).getMonth() + 1;
    }
    function getuserId(name) {
      var regExp = /\(([^)]+)\)/;
      var matches = regExp.exec(name);
      return matches[1];
    }
    function getLineChartData(obj) {
      var container = [];
      for (var o in obj) {
        container.push([
          parseInt(o),
          obj[o]
        ]);
      }
      return sortDesc(container);
    }
    function sortDesc(datacontainer) {
        datacontainer.sort(function (a, b) {
          return b[0] - a[0];
        });
      return datacontainer;
    }
  }
  SubscribeUserData.$inject = [
    '$http',
    '$q',
    '$filter',
    'lodash',
    'APP_CONFIG'
  ];
  angular.module('dataDashboard.subscribeUserData.service.SubscribeUserData', []).factory('SubscribeUserData', SubscribeUserData);
}());