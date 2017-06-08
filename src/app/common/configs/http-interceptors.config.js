(function () {
  'use strict';
  function HTTPInterceptorsConfig($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  }
  HTTPInterceptorsConfig.$inject = ['$httpProvider'];
  angular.module('maestro.common.config.HTTPInterceptorsConfig', []).config(HTTPInterceptorsConfig);
}());