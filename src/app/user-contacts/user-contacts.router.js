(function () {
  'use strict';

  function UserContactsRouter($stateProvider) {
    $stateProvider
      .state('dashboard.userContacts', {
        templateUrl: 'app/user-contacts/user-contacts.html',
        url: '/downloadables',
        controller: 'UserContactsController',
        controllerAs: 'userContactsVm'
      });
  }

  UserContactsRouter.$inject = ['$stateProvider'];

  angular.module('dataDashboard.userContacts.UserContactsRouter', [])
    .config(UserContactsRouter);
})();

