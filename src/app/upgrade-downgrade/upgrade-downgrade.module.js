(function () {
  'use strict';
  angular.module('dataDashboard.upgradeDowngrade', [
    // Controllers
    'dataDashboard.upgradeDowngrade.controller.UpgradeDowngradeController',
    // Services
    'dataDashboard.upgradeDowngrade.service.UpgradeDowngrade',
    // Router
    'dataDashboard.upgradeDowngrade.UpgradeDowngradeRouter'
  ]);
}());