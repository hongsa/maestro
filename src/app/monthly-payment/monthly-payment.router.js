(function () {
  'use strict';
  function MonthlyPaymentRouter($stateProvider) {
    $stateProvider.state('dashboard.monthlyPayment', {
      templateUrl: 'app/monthly-payment/monthly-payment.html',
      url: '/monthly-payment',
      controller: 'MonthlyPaymentController',
      controllerAs: 'monthlyPaymentVm'
    });
  }
  MonthlyPaymentRouter.$inject = ['$stateProvider'];
  angular.module('dataDashboard.monthlyPayment.MonthlyPaymentRouter', []).config(MonthlyPaymentRouter);
}());