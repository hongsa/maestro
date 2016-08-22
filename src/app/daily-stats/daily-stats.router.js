(function () {
  'use strict';
  function DailyStatsRouter($stateProvider) {
    $stateProvider.state('dashboard.dailyStats', {
      templateUrl: 'app/daily-stats/daily-stats.html',
      url: '/daily-stats',
      controller: 'DailyStatsController',
      controllerAs: 'dailyStatsVm'
    }).state('dashboard.dailyStats.main', {
      url: '/main',
      views: {
        'post-stats': {
          templateUrl: 'app/daily-stats/post-stats/post-stats.html',
          controller: 'PostStatsController',
          controllerAs: 'postStatsVm'
        },
        'classes-schools': {
          templateUrl: 'app/daily-stats/classes-schools/classes-schools.html',
          controller: 'ClassesSchoolsStatsController',
          controllerAs: 'classesSchoolsStatsVm'
        },
        'visits': {
          templateUrl: 'app/daily-stats/visits/visits.html',
          controller: 'VisitsStatsController',
          controllerAs: 'visitsStatsVm'
        },
        'user-stats': {
          templateUrl: 'app/daily-stats/user-stats/user-stats.html',
          controller: 'UserStatsController',
          controllerAs: 'userStatsVm'
        }
      }
    });
  }
  DailyStatsRouter.$inject = ['$stateProvider'];
  angular.module('dataDashboard.dailyStats.DailyStatsRouter', []).config(DailyStatsRouter);
}());