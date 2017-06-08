(function () {
  'use strict';

  function FindContentFactory($http, $q, APP_CONFIG) {
    return {
      getFindContent:getFindContent
    };

    function getFindContent(curriculum_type, subjectId, unitName, dataContainer) {
      var deferred = $q.defer();
      var query = '/lc_db_prd/_proc/get_preceding_cards_by_unit_name';
      var data = {
        params: [
          {
            name: "_curriculum_type",
            value: curriculum_type
          },
          {
            name: "_subject_id",
            value: subjectId
          },
          {
            name: "_unit_name",
            value: unitName
          },
          {
            name: "_limit",
            value: 50
          }
        ]
      };
      $http({
        url: APP_CONFIG.BACKEND_ADDRESS + query,
        method: 'POST',
        headers: {
          'X-DreamFactory-Application-Name': APP_CONFIG.DSP_API_NAME,
          'X-DreamFactory-Api-Key': APP_CONFIG.DSP_API_KEY,
          'Content-Type': 'application/json; charset=UTF-8'
        },
        data: data
      }).then(function (result) {
        dataContainer.splice(0);
        result.data.forEach(function (row) {
          dataContainer.push(row);
        });
        deferred.resolve({ status: result.status });
      }, deferred.reject);
      return deferred.promise;
    }

  }

  FindContentFactory.$inject = ['$http', '$q', 'APP_CONFIG'];

  angular.module('maestro.main.factory.FindContentFactory', [])
      .factory('FindContentFactory', FindContentFactory);
})();
