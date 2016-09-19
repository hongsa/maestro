(function () {
  'use strict';
  function PreferredSubjects($http, $q, $rootScope, $filter, APP_CONFIG) {
    return { getData: getData };
    function getData(dataContainer) {
      var deferred = $q.defer();
      var query = '/lc_db_prd/_proc/preferred_subjects';
      $http({
        url: APP_CONFIG.BACKEND_ADDRESS + query,
        method: 'GET',
        headers: {
          'X-DreamFactory-Application-Name': APP_CONFIG.DSP_API_NAME,
          'X-DreamFactory-Api-Key': APP_CONFIG.DSP_API_KEY
        }
      }).then(function (result) {
        result.data.forEach(function (row) {
          dataContainer.push({
            subject_id: parseInt(row.subject_id) || null,
            grade_id: parseInt(row.grade_id) || null,
            count: parseInt(row['COUNT(*)'])
          });
        });
        deferred.resolve({ name: 'success' });
      }, deferred.reject);
      return deferred.promise;
    }
  }
  PreferredSubjects.$inject = [
    '$http',
    '$q',
    '$rootScope',
    '$filter',
    'APP_CONFIG'
  ];
  angular.module('dataDashboard.preferredSubjects.service.PreferredSubjects', []).factory('PreferredSubjects', PreferredSubjects);
}());