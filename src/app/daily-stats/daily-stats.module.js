(function () {
  'use strict';
  angular.module('dataDashboard.dailyStats', [
    // Controllers
    'dataDashboard.dailyStats.controller.DailyStatsController',
    'dataDashboard.dailyStats.controller.PostStatsController',
    'dataDashboard.dailyStats.controller.ClassesSchoolsStatsController',
    'dataDashboard.dailyStats.controller.VisitsStatsController',
    'dataDashboard.dailyStats.controller.UserStatsController',
    // Services
    'dataDashboard.dailyStats.service.DailyStats',
    // Router
    'dataDashboard.dailyStats.DailyStatsRouter'
  ]);
}());