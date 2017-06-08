(function () {
  'use strict';
  angular.module('maestro.main', [
    // Controllers
    'maestro.main.controller.MainController',
    'maestro.main.controller.SkillDetailController',
    'maestro.main.controller.FindContentController',
    // Services
    'maestro.main.service.Main',
    'maestro.main.service.SkillDetail',
    'maestro.main.service.FindContent',
    // Router
    'maestro.main.MainRouter',
    'maestro.main.HomeRouter',
    // Factory
    'maestro.main.factory.SkillDetailFactory',
    'maestro.main.factory.FindContentFactory'
  ]);
}());