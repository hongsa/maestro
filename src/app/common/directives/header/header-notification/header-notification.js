(function() {
  'use strict';

  function Controller(SigninService, $rootScope) {
    var vm = this;

    vm.userName = $rootScope.user.display_name;
    vm.signout = SigninService.signout;
  }

  Controller.$inject = ['SigninService', '$rootScope'];

  function headerNotificationDirective() {
    return {
      templateUrl: 'app/common/directives/header/header-notification/header-notification.html',
      restrict: 'E',
      replace: true,
      controller: Controller,
      controllerAs: 'headerNotificationVm'
    }
  }

  angular.module('dataDashboard.common.directive.headerNotificationDirective', [])
    .directive('headerNotification', headerNotificationDirective);
})();
