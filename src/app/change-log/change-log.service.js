(function() {
  'use strict';

  function ChangeLog($http, $q, APP_CONFIG) {
    return {
    };

  }

  ChangeLog.$inject = ['$http', '$q', 'APP_CONFIG'];

  angular.module('dataDashboard.changeLog.service.ChangeLog', [])
      .factory('ChangeLog', ChangeLog);
})();
