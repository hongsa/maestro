(function () {
  'use strict';
  function PreferredSubjectsRouter($stateProvider) {
    $stateProvider.state('dashboard.preferredSubjects', {
      templateUrl: 'app/preferred-subjects/preferred-subjects.html',
      url: '/preferred-subjects',
      controller: 'PreferredSubjectsController',
      controllerAs: 'preferredSubjectsVm'
    });
  }
  PreferredSubjectsRouter.$inject = ['$stateProvider'];
  angular.module('dataDashboard.preferredSubjects.PreferredSubjectsRouter', []).config(PreferredSubjectsRouter);
}());