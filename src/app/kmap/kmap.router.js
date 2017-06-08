(function () {
  'use strict';
  function KmapRouter($stateProvider) {
    $stateProvider.state('maestro.kmap', {
      url: '/kmap',
      templateUrl: 'app/kmap/kmap.html'
    });
  }
  KmapRouter.$inject = ['$stateProvider'];
  angular.module('maestro.kmap.KmapRouter', []).config(KmapRouter);
}());