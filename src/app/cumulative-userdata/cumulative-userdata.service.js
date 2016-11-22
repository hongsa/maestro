(function () {
  'use strict';
  var dayInMS = 86400000;
  function CumulativeUserData($http, $q, $filter, APP_CONFIG) {
    return { getCumulativeUserData: getCumulativeUserData };
    function getCumulativeUserData(dataContainer, selectedRange, paidFilter, startDate, endDate) {
      var deferred = $q.defer();
      var query = createQueryString(paidFilter);
      var prevValue = 0;
      var criteria = -1;
      var compareNum;
      $http({
        url: APP_CONFIG.BACKEND_ADDRESS + query,
        method: 'GET',
        headers: {
          'X-DreamFactory-Application-Name': APP_CONFIG.DSP_API_NAME,
          'X-DreamFactory-Api-Key': APP_CONFIG.DSP_API_KEY
        }
      }).then(function (result) {
        dataContainer.data.splice(0);
        if (!result.data.timed_out && result.data.length > 0) {
          result.data.forEach(function (item) {
            if (getTimeStampFromStr(startDate) >= stringToDate(item.created_at)) {
              prevValue += parseInt(item.num, 10);
            } else if (getTimeStampFromStr(startDate) < stringToDate(item.created_at) && getTimeStampFromStr(endDate) >= stringToDate(item.created_at)) {
              if (selectedRange === 'daily') {
                dataContainer.data.push([
                  stringToDate(item.created_at),
                  prevValue + (parseInt(item.num, 10) || 0)
                ]);
                prevValue = dataContainer.data[dataContainer.data.length - 1][1];
              } else {
                if (selectedRange === 'weekly') {
                  compareNum = 7;
                } else if (selectedRange === 'monthly') {
                  compareNum = 30;
                } else {
                  compareNum = 365;
                }
                if (criteria + dayInMS * compareNum > stringToDate(item.created_at)) {
                  prevValue += parseInt(item.num, 10);
                } else {
                  dataContainer.data.push([
                    stringToDate(item.created_at),
                    prevValue + (parseInt(item.num, 10) || 0)
                  ]);
                  prevValue = dataContainer.data[dataContainer.data.length - 1][1];
                  criteria = stringToDate(item.created_at);
                }
              }
            }
          });
          if (prevValue > dataContainer.data[dataContainer.data.length - 1][1]) {
            dataContainer.data.push([
              stringToDate(result.data[result.data.length - 1].created_at),
              prevValue
            ]);
          }
        }
        deferred.resolve({ name: 'success' });
      }, deferred.reject);
      return deferred.promise;
    }
    function getTimeStampFromStr(date) {
      var timestamp = new Date(date).setHours(12, 0, 0, 0);
      return new Date(timestamp).getTime();
    }
    function stringToDate(str) {
      var y = str.toString().substr(0,4),
          m = str.toString().substr(5,2) - 1,
          d = str.toString().substr(8,2),
          date = new Date(y,m,d).setHours(12, 0, 0, 0);

      return new Date(date).getTime();
    }

    function createQueryString(paidFilter) {
      var query = '';
      if (paidFilter === 'all') {
        query = '/lc_db_prd/_proc/total_user';
      } else if (paidFilter === 'free') {
        query = '/lc_db_prd/_proc/free_user';
      } else if (paidFilter === 'paid') {
        query = '/lc_db_prd/_proc/paid_user';
      } else if (paidFilter === 'basic') {
        query = '/lc_db_prd/_proc/basic_paid_user';
      } else if (paidFilter === 'standard') {
        query = '/lc_db_prd/_proc/standard_paid_user';
      } else {
        query = '/lc_db_prd/_proc/premium_paid_user';
      }
      return query;
    }
  }
  CumulativeUserData.$inject = [
    '$http',
    '$q',
    '$filter',
    'APP_CONFIG'
  ];
  angular.module('dataDashboard.cumulativeUserData.service.CumulativeUserData', []).factory('CumulativeUserData', CumulativeUserData);
}());