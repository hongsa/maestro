(function () {
  'use strict';

  function CommonRouter($stateProvider) {
    $stateProvider
      .state('dashboard.blank', {
        templateUrl: 'app/main/blank.html',
        url: '/blank'
      })
      .state('dashboard.table', {
        templateUrl: 'app/table/table.html',
        url: '/table'
      })
      .state('dashboard.panels-wells', {
        templateUrl: 'app/common/ui-elements/panels-wells.html',
        url: '/panels-wells'
      })
      .state('dashboard.buttons', {
        templateUrl: 'app/common/ui-elements/buttons.html',
        url: '/buttons'
      })
      .state('dashboard.notifications', {
        templateUrl: 'app/common/ui-elements/notifications.html',
        url: '/notifications'
      })
      .state('dashboard.typography', {
        templateUrl: 'app/common/ui-elements/typography.html',
        url: '/typography'
      })
      .state('dashboard.icons', {
        templateUrl: 'app/common/ui-elements/icons.html',
        url: '/icons'
      })
      .state('dashboard.grid', {
        templateUrl: 'app/common/ui-elements/grid.html',
        url: '/grid'
      });
  }

  CommonRouter.$inject = ['$stateProvider'];

  angular.module('dataDashboard.common.CommonRouter', [])
    .config(CommonRouter);
})();

