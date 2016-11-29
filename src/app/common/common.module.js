(function () {
  'use strict';
  angular.module('dataDashboard.common', [
    // Configs
    'dataDashboard.common.config.MainConfig',
    'dataDashboard.common.config.HTTPInterceptorsConfig',
    // Directives
    'dataDashboard.common.directive.headerDirective',
    'dataDashboard.common.directive.headerNotificationDirective',
    'dataDashboard.common.directive.sidebarDirective',
    'dataDashboard.common.directive.sidebarSearchDirective',
    'dataDashboard.common.directive.dirPagination',
    // Constants
    'dataDashboard.common.constant.APP_CONFIG',
    // Router
    'dataDashboard.common.CommonRouter',
    // Interceptors
    'dataDashboard.common.interceptor.AuthInterceptor',
    // Runs
    'dataDashboard.common.run.FetchUserFromLocalStorageRun',
    'dataDashboard.common.run.RouterPermissionRun',
    // Filters
    'dataDashboard.common.filter.percentage',
    'dataDashboard.common.filter.titleCase',
    'dataDashboard.common.filter.country',
    'dataDashboard.common.filter.language',
    'dataDashboard.common.filter.device',
    'dataDashboard.common.filter.month',
    'dataDashboard.common.filter.publisher',
    'dataDashboard.common.filter.series',
    'dataDashboard.common.filter.grade',
    'dataDashboard.common.filter.price',
    'dataDashboard.common.filter.subject',
    'dataDashboard.common.filter.pageName',
    'dataDashboard.common.filter.pageName2',
    'dataDashboard.common.filter.subscribe',
    // Utils
    'dataDashboard.common.utils.LinechartUtils',
    'dataDashboard.common.utils.BarchartUtils',
    'dataDashboard.common.utils.PiechartUtils',
    'dataDashboard.common.utils.CSVparserUtils',
    'dataDashboard.common.utils.CommonUtils'
  ]);
}());