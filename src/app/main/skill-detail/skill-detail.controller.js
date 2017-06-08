(function () {
  'use strict';


  function SkillDetailController(baseData, SkillDetailFactory) {
    var vm = this;
    console.log(baseData)
    vm.baseData = baseData;

  }

  SkillDetailController.$inject = [
    'baseData',
    'SkillDetailFactory'
  ];

  angular.module('maestro.main.controller.SkillDetailController', [])
      .controller('SkillDetailController', SkillDetailController);
})();
