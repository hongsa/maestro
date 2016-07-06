(function () {
  'use strict';

  function CohortAnalysisRouter($stateProvider) {
    $stateProvider
      .state('dashboard.cohortAnalysis', {
        templateUrl: 'app/cohort-analysis/cohort-analysis.html',
        url: '/cohort-analysis',
        controller: 'CohortAnalysisController',
        controllerAs: 'cohortAnalysisVm'
      });
  }

  CohortAnalysisRouter.$inject = ['$stateProvider'];

  angular.module('dataDashboard.cohortAnalysis.CohortAnalysisRouter', [])
    .config(CohortAnalysisRouter);
})();

