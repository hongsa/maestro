(function () {
  'use strict';

  function FindContentController(curriculum_type, subjectId, selectedUnitName, FindContentFactory) {
    var vm = this;
    vm.curriculum_type = curriculum_type;
    vm.subjectId = subjectId;
    vm.selectedUnitName = selectedUnitName;
    vm.contentList = [];

    findContent();

    function findContent() {
      FindContentFactory.getFindContent(vm.curriculum_type, vm.subjectId, vm.selectedUnitName, vm.contentList).then(function (response) {
        if (response.status === 200) {
        }
      });
    }

  }

  FindContentController.$inject = [
    'curriculum_type',
    'subjectId',
    'selectedUnitName',
    'FindContentFactory'
  ];

  angular.module('maestro.main.controller.FindContentController', [])
      .controller('FindContentController', FindContentController);
})();
