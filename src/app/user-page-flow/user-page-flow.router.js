(function () {
  'use strict';
  function UserPageFlowRouter($stateProvider) {
    $stateProvider.state('dashboard.userPageFlow', {
      templateUrl: 'app/user-page-flow/user-page-flow.html',
      url: '/user-page-flow',
      controller: 'UserPageFlowController',
      controllerAs: 'userPageFlowVm'
    });
  }
  UserPageFlowRouter.$inject = ['$stateProvider'];
  angular.module('dataDashboard.userPageFlow.UserPageFlowRouter', []).config(UserPageFlowRouter);
}());