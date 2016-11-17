(function () {
  'use strict';
  function AARRRController(AARRR, APP_CONFIG) {
    var vm = this;
    vm.dataSignUpContainer = [];
    vm.dataDownloadContainer = [];
    vm.dataResultContainer = [];
    vm.dataActiveContainer = [];
    vm.dataPaymentContainer = [];
    vm.signUpToDownload = [];
    vm.downloadToResult = [];
    vm.resultToActive = [];
    vm.activeToPayment = [];
    vm.endDate = new Date();
    vm.startDate = new Date(new Date().setDate(new Date().getDate() - 7));
    init();
    vm.getData = getData;
    function init() {
    }
    function getData() {
      if (vm.endDate.getTime() - vm.startDate.getTime() <= 604800000) {
        AARRR.getSignUpUser(vm.dataSignUpContainer, vm.startDate, vm.endDate).then(function (result) {
          if (result.status === 200) {
            AARRR.getDownloadUser(vm.dataDownloadContainer, vm.dataSignUpContainer, vm.signUpToDownload, vm.startDate, vm.endDate).then(function (result) {
              if (result.status === 200) {
                AARRR.getResultUser(vm.dataResultContainer, vm.signUpToDownload, vm.downloadToResult, vm.startDate, vm.endDate).then(function (result) {
                  if (result.status === 200) {
                    AARRR.getActiveUser(vm.dataActiveContainer, vm.downloadToResult, vm.resultToActive, vm.startDate, vm.endDate).then(function (result) {
                      if (result.status === 200) {
                        AARRR.getPaymentUser(vm.dataPaymentContainer, vm.resultToActive, vm.activeToPayment, vm.startDate, vm.endDate);
                      }
                    });
                  }
                });
              }
            });
          }
        });
      } else {
        alert('1주일 이내로 범위를 지정해주세요.');
      }
    }
  }
  AARRRController.$inject = [
    'AARRR',
    'APP_CONFIG'
  ];
  angular.module('dataDashboard.aarrr.controller.AARRRController', []).controller('AARRRController', AARRRController);
}());