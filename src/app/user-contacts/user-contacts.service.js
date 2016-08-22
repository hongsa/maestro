(function () {
  'use strict';
  function UserContacts($http, $q, APP_CONFIG, CSVparserUtils) {
    return { fetchAndDownloadActiveTeachersContacts: fetchAndDownloadActiveTeachersContacts };
    function fetchAndDownloadActiveTeachersContacts(subject, yearFilter, monthFilter, countryFilter) {
      var deferred = $q.defer(), filename = getFilename(subject, yearFilter, monthFilter, countryFilter);
      $http({
        url: APP_CONFIG.S3_DATA_BUCKET + getDirectoryName(subject) + filename,
        method: 'GET',
        headers: { 'Content-Type': undefined }
      }).then(function (result) {
        CSVparserUtils.downloadCSV(result.data, true, filename);
        deferred.resolve();
      }, deferred.reject);
      return deferred.promise;
    }
    function getDirectoryName(subject) {
      if (subject === 'user-contacts' || subject === 'jp-teachers') {
        return '/user_contacts/';
      } else if (subject === 'jp-classes') {
        return '/class-links/';
      }
    }
    function getFilename(subject, yearFilter, monthFilter, countryFilter) {
      if (subject === 'user-contacts') {
        var dateCopy = new Date([
            yearFilter,
            parseInt(monthFilter) + 1,
            '01'
          ].join('-')), startDate = getDateInString(dateCopy), endDate;
        dateCopy.setMonth(dateCopy.getMonth() + 1);
        dateCopy.setDate(0);
        endDate = getDateInString(dateCopy);
        return 'active-teachers_' + startDate + '-' + endDate + '_dau_' + countryFilter + '.csv';
      } else if (subject === 'jp-teachers') {
        return 'japanese-teachers.csv';
      } else if (subject === 'jp-classes') {
        return 'japanese-classes.csv';
      }
    }
    function getDateInString(date) {
      return (date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()).toString();
    }
  }
  UserContacts.$inject = [
    '$http',
    '$q',
    'APP_CONFIG',
    'CSVparserUtils'
  ];
  angular.module('dataDashboard.userContacts.service.UserContacts', []).factory('UserContacts', UserContacts);
}());