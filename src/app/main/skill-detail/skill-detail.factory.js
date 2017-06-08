(function () {
  'use strict';

  function SkillDetailFactory($http, $q, APP_CONFIG) {
    return {
    };

  }

  SkillDetailFactory.$inject = ['$http', '$q', 'APP_CONFIG'];

  angular.module('maestro.main.factory.SkillDetailFactory', [])
      .factory('SkillDetailFactory', SkillDetailFactory);
})();
