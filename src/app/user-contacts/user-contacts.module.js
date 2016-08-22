(function () {
  'use strict';
  angular.module('dataDashboard.userContacts', [
    // Controllers
    'dataDashboard.userContacts.controller.UserContactsController',
    // Services
    'dataDashboard.userContacts.service.UserContacts',
    // Router
    'dataDashboard.userContacts.UserContactsRouter'
  ]);
}());