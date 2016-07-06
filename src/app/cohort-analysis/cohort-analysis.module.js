(function() {
  'use strict';

  angular.module('dataDashboard.cohortAnalysis', [
    // Controllers
    'dataDashboard.cohortAnalysis.controller.CohortAnalysisController',

    // Services
    'dataDashboard.cohortAnalysis.service.CohortAnalysis',

    // Router
    'dataDashboard.cohortAnalysis.CohortAnalysisRouter',

    // Dummy data
    'dataDashboard.cohortAnalysis.constant.DUMMY4'
  ]);
})();
