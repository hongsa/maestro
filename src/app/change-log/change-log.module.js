(function () {
  'use strict';

  angular.module('dataDashboard.changeLog', [
    // Controllers
    'dataDashboard.changeLog.controller.ChangeLogController',

    // Services
    'dataDashboard.changeLog.service.ChangeLog',

    // Router
    'dataDashboard.changeLog.ChangeLogRouter'
  ]);
})();
