(function () {
  'use strict';

  function RouterPermissionRun($rootScope, $state, $location) {
    $rootScope.$on('$stateChangeStart', function (event, toState) {
      if(toState.name === "signin") return;
      else if(!$rootScope.isLoggedIn) {
        event.preventDefault();
        $state.go('signin');
      } else return;
    });
  }

  RouterPermissionRun.$inject = ['$rootScope', '$state', '$location'];

  angular.module('dataDashboard.common.run.RouterPermissionRun', [])
    .run(RouterPermissionRun);
})();