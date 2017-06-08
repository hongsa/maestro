(function () {
  'use strict';
  angular.module('maestro.common', [
    // Configs
    'maestro.common.config.MainConfig',
    'maestro.common.config.HTTPInterceptorsConfig',
    // Directives
    'maestro.common.directive.headerDirective',
    'maestro.common.directive.headerNotificationDirective',
    'maestro.common.directive.sidebarDirective',
    'maestro.common.directive.sidebarSearchDirective',
    'maestro.common.directive.dirPagination',
    // Constants
    'maestro.common.constant.APP_CONFIG',
    // Router
    'maestro.common.CommonRouter',
    // Interceptors
    'maestro.common.interceptor.AuthInterceptor',
    // Runs
    'maestro.common.run.FetchUserFromLocalStorageRun',
    'maestro.common.run.RouterPermissionRun',
    // Filters
    'maestro.common.filter.percentage',
    'maestro.common.filter.titleCase',
    'maestro.common.filter.device',
    'maestro.common.filter.month',
    'maestro.common.filter.grade',
    'maestro.common.filter.subject',
    'maestro.common.filter.achievement',
    'maestro.common.filter.duration',
    'maestro.common.filter.cardDetail',
    // Utils
    'maestro.common.utils.LinechartUtils',
    'maestro.common.utils.BarchartUtils',
    'maestro.common.utils.PiechartUtils',
    'maestro.common.utils.CSVparserUtils',
    'maestro.common.utils.CommonUtils'
  ]);
}());