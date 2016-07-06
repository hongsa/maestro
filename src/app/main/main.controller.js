(function () {
  'use strict';

  function MainController($scope, $position, $rootScope) {
  }

  MainController.$inject = ['$position', '$scope', '$rootScope'];

  angular.module('dataDashboard.main.controller.MainController', [])
    .controller('MainController', MainController);
})();