(function () {
  'use strict';
  var dayInMS = 86400000;
  var today = new Date().setHours(12, 0, 0, 0);
  function DownloadedCard($http, $q, $filter, APP_CONFIG) {
    return {
      getDownloadedData: getDownloadedData,
      getPublisherKeys: getPublisherKeys
    };
    function getDownloadedData(dataContainer, selectedRange, publisherFilter, paidFilter, startDate, endDate) {
      var deferred = $q.defer();
      var query = createQueryString(selectedRange, publisherFilter, paidFilter, startDate, endDate);
      var compareNum;
      $http({
        url: APP_CONFIG.ELASTIC_SEARCH_SQL + '?sql=' + query,
        method: 'GET',
        headers: { 'Content-Type': undefined }
      }).then(function (result) {
        if (!result.data.timed_out) {
          dataContainer.data.splice(0);
          result.data.aggregations.timestamp.buckets.forEach(function (item) {
            var key;
            if (selectedRange === 'daily') {
              compareNum = 0;
            } else if (selectedRange === 'weekly') {
              compareNum = 6;
            } else if (selectedRange === 'monthly') {
              key = new Date(new Date(item.key).getFullYear(), new Date(item.key).getMonth() + 1, 0, 12, 0, 0);
            } else {
            }
            if (selectedRange !== 'monthly') {
              key = getTimeStampFromStr(item.key) + compareNum * dayInMS;
            }
            if (key > today) {
              key = today;
            }
            var itemCount = 0;
            item.user_id.buckets.forEach(function (row) {
              itemCount += row.card_id.buckets.length;
            });
            dataContainer.data.push([
              key,
              parseInt(itemCount, 10) || 0
            ]);
          });
        }
        deferred.resolve({ name: 'success' });
      }, deferred.reject);
      return deferred.promise;
    }
    function getPublisherKeys(publisherKeyContainer, startDate, endDate) {
      var deferred = $q.defer();
      var query = 'SELECT publisher_id' + createFromRangeString(startDate, endDate) + ' GROUP BY publisher_id';
      $http({
        url: APP_CONFIG.ELASTIC_SEARCH_SQL + '?sql=' + query,
        method: 'GET',
        headers: { 'Content-Type': undefined }
      }).then(function (result) {
        if (!result.data.timed_out && result.data.aggregations) {
          publisherKeyContainer.splice(0);
          publisherKeyContainer.push(-1);
          result.data.aggregations.publisher_id.buckets.forEach(function (row) {
            if (publisherKeyContainer.indexOf(row.key) === -1) {
              publisherKeyContainer.push(row.key);
            }
          });
        }
        deferred.resolve();
      }, deferred.reject);
      return deferred.promise;
    }
    function getTimeStampFromStr(date) {
      var timestamp = new Date(date).setHours(12, 0, 0, 0);
      return new Date(timestamp).getTime();
    }
    function createQueryString(selectedRange, publisherFilter, paidFilter, startDate, endDate) {
      var query = 'SELECT count(*)';
      query += createFromRangeString(startDate, endDate);
      query += createWhereFilterString(publisherFilter, startDate, endDate);
      query += createGroupByString(selectedRange);
      return query;
    }
    function createFromRangeString(startDate, endDate) {
      var startDateCopy = new Date(startDate.getTime());
      var endDateNums = getDateInNumbers(endDate);
      var firstIndex = formatDateName(getDateInNumbers(startDate));
      var from = ' FROM ' + firstIndex;
      startDateCopy.setDate(startDateCopy.getDate() + 1);
      var currentDate = startDateCopy.getDate();
      var startDateNums = getDateInNumbers(startDateCopy);
      var prevDatePosition = getDateInNumbers(startDate).toString().substring(6, 7);
      var prevIndex = firstIndex;
      var currentIndex;
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
    function createWhereFilterString(publisherFilter, startDate, endDate) {
      var where = ' WHERE _type="download"';
      where += getPublisherFilterClause(publisherFilter);
      where += getDateFilterString(startDate, endDate);
      return where;
    }
    function getDateFilterString(startDate, endDate) {
      var endDateCopy = new Date(endDate.getTime());
      endDateCopy.setDate(endDateCopy.getDate() + 1);
      var startDateStr = formatDateName(getDateInNumbers(startDate), '-');
      var endDateStr = formatDateName(getDateInNumbers(endDateCopy), '-');
      return ' AND @timestamp BETWEEN "' + startDateStr + '" AND "' + endDateStr + '"';
    }
    function getPublisherFilterClause(publisherFilter) {
      if (publisherFilter === '-1') {
        return '';
      }
      return ' AND publisher_id=' + publisherFilter;
    }
    function createGroupByString(interval) {
      if (interval === 'daily') {
        interval = '1d';
      } else if (interval === 'weekly') {
        interval = '7d';
      } else {
        interval = '1M';
      }
      return ' GROUP BY date_histogram("alias"="timestamp", field="@timestamp","interval"="' + interval + '"), user_id, card_id';
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
  }
  DownloadedCard.$inject = [
    '$http',
    '$q',
    '$filter',
    'APP_CONFIG'
  ];
  angular.module('dataDashboard.downloadedCard.service.DownloadedCard', []).factory('DownloadedCard', DownloadedCard);
}());