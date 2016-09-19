(function () {
  'use strict';
  angular.module('dataDashboard.preferredSubjects', [
    // Controllers
    'dataDashboard.preferredSubjects.controller.PreferredSubjectsController',
    // Services
    'dataDashboard.preferredSubjects.service.PreferredSubjects',
    // Router
    'dataDashboard.preferredSubjects.PreferredSubjectsRouter'
  ]);
}());