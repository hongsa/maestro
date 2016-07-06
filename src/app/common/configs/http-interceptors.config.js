(function () {
  'use strict';

  function HTTPInterceptorsConfig($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  }

  HTTPInterceptorsConfig.$inject = ['$httpProvider'];

  angular.module('dataDashboard.common.config.HTTPInterceptorsConfig', [])
    .config(HTTPInterceptorsConfig);
})();