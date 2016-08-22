(function () {
  'use strict';
  angular.module('dataDashboard.monthlyRecurringRevenue', [
    // Controllers
    'dataDashboard.monthlyRecurringRevenue.controller.MonthlyRecurringRevenueController',
    // Services
    'dataDashboard.monthlyRecurringRevenue.service.MonthlyRecurringRevenue',
    // Router
    'dataDashboard.monthlyRecurringRevenue.MonthlyRecurringRevenueRouter'
  ]);
}());