(function () {
  'use strict';
  function CommonUtils() {
    return { convertObjectToArray: convertObjectToArray };
    function convertObjectToArray(obj) {
      return Object.keys(obj).map(function (key) {
        return obj[key];
      });
    }
  }
  angular.module('maestro.common.utils.CommonUtils', []).factory('CommonUtils', CommonUtils);
}());