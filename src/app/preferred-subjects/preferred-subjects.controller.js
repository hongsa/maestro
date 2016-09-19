(function () {
  'use strict';
  function PreferredSubjectsController(PreferredSubjects, APP_CONFIG) {
    var vm = this;
    vm.dataContainer = [];
    vm.selectedSortType = 'count';
    vm.selectedOrderBy = 'ASC';
    vm.getData = getData;
    vm.sortType = sortType;
    init();
    function init() {
      getData();
    }
    function getData() {
      PreferredSubjects.getData(vm.dataContainer).then(function (result) {
        sortType('count');
      });
    }
    function sortType(type) {
      vm.selectedSortType = type;
      if (vm.selectedOrderBy === 'DESC') {
        vm.selectedOrderBy = 'ASC';
      } else {
        vm.selectedOrderBy = 'DESC';
      }
      pageChanged();
    }
    function pageChanged() {
      var orderBy = 0;
      if (vm.selectedOrderBy === 'ASC') {
        orderBy = -1;
      } else {
        orderBy = 1;
      }
      if (vm.selectedSortType === 'grade_id') {
        vm.dataContainer.sort(function (a, b) {
          if (orderBy === 1) {
            return b.grade_id - a.grade_id;
          } else {
            return a.grade_id - b.grade_id;
          }
        });
      } else if (vm.selectedSortType === 'subject_id') {
        vm.dataContainer.sort(function (a, b) {
          if (orderBy === 1) {
            return b.subject_id - a.subject_id;
          } else {
            return a.subject_id - b.subject_id;
          }
        });
      } else {
        vm.dataContainer.sort(function (a, b) {
          if (orderBy === 1) {
            return b.count - a.count;
          } else {
            return a.count - b.count;
          }
        });
      }
    }
  }
  PreferredSubjectsController.$inject = [
    'PreferredSubjects',
    'APP_CONFIG'
  ];
  angular.module('dataDashboard.preferredSubjects.controller.PreferredSubjectsController', []).controller('PreferredSubjectsController', PreferredSubjectsController);
}());