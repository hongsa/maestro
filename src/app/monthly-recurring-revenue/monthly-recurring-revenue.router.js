(function () {
  'use strict';

  function MonthlyRecurringRevenueRouter($stateProvider) {
    $stateProvider
      .state('dashboard.monthlyRecurringRevenue', {
        templateUrl: 'app/monthly-recurring-revenue/monthly-recurring-revenue.html',
        url: '/monthly-recurring-revenue',
        controller: 'MonthlyRecurringRevenueController',
        controllerAs: 'monthlyRecurringRevenueVm'
      });
  }

  MonthlyRecurringRevenueRouter.$inject = ['$stateProvider'];

  angular.module('dataDashboard.monthlyRecurringRevenue.MonthlyRecurringRevenueRouter', [])
    .config(MonthlyRecurringRevenueRouter);
})();

