(function () {
  'use strict';
  function SigninService($http, $q, $cookies, $rootScope, APP_CONFIG) {
    this.signin = signin;
    this.signup = signup;
    this.signout = signout;
    function signin(data) {
      var deferred = $q.defer();
      $http({
        url: APP_CONFIG.BACKEND_ADDRESS + '/user/session/',
        method: 'POST',
        headers: { 'X-DreamFactory-Application-Name': APP_CONFIG.DSP_API_NAME },
        data: data
      }).then(function (result) {
        //$http.defaults.headers.common['X-DreamFactory-Session-Token'] = result.data.session_id; // DSP 2.0: result.data.session_token;
        $cookies.session_token = result.data.session_id;
        // DSP 2.0: result.data.session_token;
        $rootScope.user = result.data;
        try {
          window.localStorage.user = JSON.stringify(result.data);
        } catch (e) {
        }
        deferred.resolve();
      }, deferred.reject);
      return deferred.promise;
    }
    function signup(data) {
      var deferred = $q.defer();
      $http({
        url: APP_CONFIG.BACKEND_ADDRESS + '/user/register?login=true',
        method: 'POST',
        headers: { 'Content-Type': undefined },
        data: data
      }).then(function (result) {
        deferred.resolve();
      }, deferred.reject);
      return deferred.promise;
    }
    function signout() {
      // should delete session as well
      // this should be used when CORS problem is resolved
      // $http({
      //   url: APP_CONFIG.BACKEND_ADDRESS + '/api/v2/user/session',
      //   method: 'DELETE',
      //   headers: {
      //     'Content-Type': undefined
      //   }
      // }).success(function () {
      // });
      $http.defaults.headers.common['X-DreamFactory-Session-Token'] = undefined;
      $cookies.session_token = undefined;
      $rootScope.user = undefined;
      $rootScope.isLoggedIn = false;
      try {
        window.localStorage.user = undefined;
      } catch (e) {
      }
    }
  }
  SigninService.$inject = [
    '$http',
    '$q',
    '$cookies',
    '$rootScope',
    'APP_CONFIG'
  ];
  angular.module('dataDashboard.signin.service.SigninService', ['ngCookies']).service('SigninService', SigninService);
}());