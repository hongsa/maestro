(function () {
  'use strict';

  function FindContent($uibModal) {
    this.open = function (curriculum_type, subjectId, selectedUnitName) {
      return $uibModal.open({
        templateUrl: 'app/main/find-content/find-content.html',
        controller: 'FindContentController',
        controllerAs: 'findContentVm',
        size: 'lg',
        resolve: {
          curriculum_type: function () {
            return curriculum_type;
          },
          subjectId: function () {
            return subjectId;
          },
          selectedUnitName: function () {
            return selectedUnitName;
          }
        }
      });
    };
  }

  FindContent.$inject = ['$uibModal'];

  angular.module('maestro.main.service.FindContent', [])
      .service('FindContent', FindContent);
})();
