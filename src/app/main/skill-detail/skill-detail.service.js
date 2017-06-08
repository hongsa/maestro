(function () {
  'use strict';

  function SkillDetail($uibModal) {
    this.open = function (baseData) {
      return $uibModal.open({
        templateUrl: 'app/main/skill-detail/skill-detail.html',
        controller: 'SkillDetailController',
        controllerAs: 'skillDetailVm',
        size: 'lg',
        resolve: {
          baseData: function () {
            return baseData;
          },
        }
      });
    };
  }

  SkillDetail.$inject = ['$uibModal'];

  angular.module('maestro.main.service.SkillDetail', [])
      .service('SkillDetail', SkillDetail);
})();
