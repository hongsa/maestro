(function () {
  'use strict';
  function SigninRouter($stateProvider) {
    $stateProvider.state('signin', {
      templateUrl: 'app/signin/signin.html',
      url: '/signin',
      controller: 'SigninController',
      controllerAs: 'signinVm'
    });
  }
  SigninRouter.$inject = ['$stateProvider'];
  angular.module('dataDashboard.signin.SigninRouter', []).config(SigninRouter);
}());