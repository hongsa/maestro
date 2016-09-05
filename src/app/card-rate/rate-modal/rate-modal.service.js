(function () {
  'use strict';
  function RateModal($uibModal) {
    this.open = function (baseData) {
      return $uibModal.open({
        templateUrl: 'app/card-rate/rate-modal/rate-modal.html',
        controller: 'RateModalController',
        controllerAs: 'rateModalVm',
        size: 'lg',
        resolve: {
          baseData: function () {
            return baseData;
          }
        }
      });
    };
  }
  RateModal.$inject = ['$uibModal'];
  angular.module('dataDashboard.cardRate.service.RateModal', []).service('RateModal', RateModal);
}());