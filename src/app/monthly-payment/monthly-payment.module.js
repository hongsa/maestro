(function () {
  'use strict';
  angular.module('dataDashboard.monthlyPayment', [
    // Controllers
    'dataDashboard.monthlyPayment.controller.MonthlyPaymentController',
    // Services
    'dataDashboard.monthlyPayment.service.MonthlyPayment',
    // Router
    'dataDashboard.monthlyPayment.MonthlyPaymentRouter'
  ]);
}());