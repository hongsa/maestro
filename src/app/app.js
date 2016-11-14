(function () {
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
    // Subscribe-Userdata
    'dataDashboard.subscribeUserData',
    // New-Cancel-Userdata
    'dataDashboard.cancelUserData',
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
    // Upgrade & Downgrade payment
    'dataDashboard.upgradeDowngrade',
    // Publisher Rate
    'dataDashboard.publisherRate',
    // Preferred Subjects
    'dataDashboard.preferredSubjects',
    // Custom Query
    'dataDashboard.customQuery'

  ]);
}());