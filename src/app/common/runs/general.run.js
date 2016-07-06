(function () {
  'use strict';

  function FetchUserFromLocalStorageRun($rootScope, $http, APP_CONFIG) {
    //$http.defaults.headers.common['X-DreamFactory-Application-Name'] = APP_CONFIG.DSP_API_KEY;
    try {
      $rootScope.user = JSON.parse(window.localStorage.user);
      if ($rootScope.user) {
        $rootScope.isLoggedIn = true;
        //$http.defaults.headers.common['X-DreamFactory-Session-Token'] = $rootScope.user.session_id;
      }
    } catch (e) {}
  }

  FetchUserFromLocalStorageRun.$inject = ['$rootScope', '$http', 'APP_CONFIG'];

  angular.module('dataDashboard.common.run.FetchUserFromLocalStorageRun', [])
    .run(FetchUserFromLocalStorageRun);
})();
