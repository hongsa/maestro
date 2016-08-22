(function () {
  'use strict';
  function SigninController($http, $rootScope, $location, APP_CONFIG, SigninService) {
    var vm = this;
    vm.email = '';
    vm.password = '';
    vm.signin = signin;
    vm.bar = 0;
    function signin() {
      SigninService.signin({
        email: vm.email,
        password: vm.password,
        duration: 315360000
      }).then(function () {
        $rootScope.isLoggedIn = true;
        $location.path('/dashboard/home');
      });
    }
  }
  SigninController.$inject = [
    '$http',
    '$rootScope',
    '$location',
    'APP_CONFIG',
    'SigninService'
  ];
  angular.module('dataDashboard.signin.controller.SigninController', []).controller('SigninController', SigninController);
}());