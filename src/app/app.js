(function() {
  'use strict';

  angular.module('dataDashboard', [
    'ngMessages',
    'ui.router',
    'ui.bootstrap',
    'ui.bootstrap.showErrors',
    'angular-loading-bar',
    'highcharts-ng',
    'ngAnimate',

    // Common
    'dataDashboard.common',

    // Cumulative-UserData
    'dataDashboard.cumulativeUserData',

    // New-Paid-Userdata
    'dataDashboard.newPaidUserData',

    // New-Cancel-Userdata
    'dataDashboard.newCancelUserData',

    // Monthly-Recurring-Revenue(MRR)
    'dataDashboard.monthlyRecurringRevenue',

    // Mobile-Store-Stats
    'dataDashboard.mobileStoreStats',

    // Active-Users
    'dataDashboard.activeUsers',

    // Cohort Analysis
    'dataDashboard.cohortAnalysis',

    // User Page Flow
    'dataDashboard.userPageFlow',

    // Custom Query
    'dataDashboard.customQuery',

    // Main
    'dataDashboard.main',

    // Signin
    'dataDashboard.signin',

    // Card Rate
    'dataDashboard.cardRate',

    // Downloaded Cards
    'dataDashboard.downloadedCard',

  ]);
})();
