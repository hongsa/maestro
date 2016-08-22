(function () {
  'use strict';
  function AuthInterceptor($q, $injector) {
    var AuthService, $http, $cookies, $rootScope, $state;
    return {
      /*
      request : function (config) {
        // TODO token-based로 갈시 작성
        return config;
      },
      */
      'responseError': responseError
    };
    function responseError(res) {
      // redirect user to signin page if 401 or 403 error occurs
      if (res.status === 401 || res.status === 403) {
        if (!$http) {
          $http = $injector.get('$http');
        }
        if (!$cookies) {
          $cookies = $injector.get('$cookies');
        }
        if (!$rootScope) {
          $rootScope = $injector.get('$rootScope');
        }
        if (!$state) {
          $state = $injector.get('$state');
        }
        $http.defaults.headers.common['X-DreamFactory-Session-Token'] = undefined;
        $cookies.session_token = undefined;
        $rootScope.user = undefined;
        $rootScope.isLoggedIn = false;
        try {
          window.localStorage.user = undefined;
        } catch (e) {
        }
        $state.go('signin');
      }
      return $q.reject(res);
    }
  }
  AuthInterceptor.$inject = [
    '$q',
    '$injector'
  ];
  angular.module('dataDashboard.common.interceptor.AuthInterceptor', []).factory('AuthInterceptor', AuthInterceptor);
}());