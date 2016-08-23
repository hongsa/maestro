(function () {
  'use strict';
  function UpgradeDowngradeRouter($stateProvider) {
    $stateProvider.state('dashboard.upgradeDowngrade', {
      templateUrl: 'app/upgrade-downgrade/upgrade-downgrade.html',
      url: '/upgrade-downgrade',
      controller: 'UpgradeDowngradeController',
      controllerAs: 'upgradeDowngradeVm'
    });
  }
  UpgradeDowngradeRouter.$inject = ['$stateProvider'];
  angular.module('dataDashboard.upgradeDowngrade.UpgradeDowngradeRouter', []).config(UpgradeDowngradeRouter);
}());