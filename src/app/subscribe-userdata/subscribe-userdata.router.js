(function () {
  'use strict';
  function SubscribeUserDataRouter($stateProvider) {
    $stateProvider.state('dashboard.subscribeUserData', {
      templateUrl: 'app/subscribe-userdata/subscribe-userdata.html',
      url: '/subscribe-userdata',
      controller: 'SubscribeUserDataController',
      controllerAs: 'subscribeUserDataVm'
    });
  }
  SubscribeUserDataRouter.$inject = ['$stateProvider'];
  angular.module('dataDashboard.subscribeUserData.SubscribeUserDataRouter', []).config(SubscribeUserDataRouter);
}());