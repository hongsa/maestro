(function() {
  'use strict';

  var minimumDate = new Date('2015-11-01'),
      defaultDate = new Date();

  defaultDate.setDate(1);
  defaultDate.setMonth(defaultDate.getMonth()-1);

  function UserContactsController(UserContacts) {
    var vm = this;

    vm.availableYears = [];
    vm.availableMonths = [];
    vm.availableCountries = ['kr', 'jp', 'us', 'tw'];
    vm.selectedYearFilter = defaultDate.getFullYear().toString();
    vm.selectedMonthFilter = defaultDate.getMonth().toString();
    vm.selectedCountryFilter = 'all';

    vm.selectYearFilter = selectYearFilter;
    vm.fetchAndDownloadCSV = fetchAndDownloadCSV;

    init();

    function init() {
      initAvailableYears();
      selectYearFilter();
    }

    function initAvailableYears() {
      for (var year = minimumDate.getFullYear(); year < defaultDate.getFullYear(); year++) {
        vm.availableYears.push(year);
      }

      vm.availableYears.push(defaultDate.getFullYear());
    }

    function selectYearFilter() {
      vm.availableMonths.splice(0);

      if (parseInt(vm.selectedYearFilter) === minimumDate.getFullYear()) {
        vm.availableMonths.push(10);
        vm.availableMonths.push(11);

        if (parseInt(vm.selectedMonthFilter) < 10) {
          vm.selectedMonthFilter = '11';
        }
      } else if (parseInt(vm.selectedYearFilter) === defaultDate.getFullYear()) {
        var dateCopy = new Date(vm.selectedYearFilter + '-01-01');

        while (dateCopy.getMonth() < defaultDate.getMonth()) {
          vm.availableMonths.push(dateCopy.getMonth());
          dateCopy.setMonth(dateCopy.getMonth()+1);
        }
        vm.availableMonths.push(defaultDate.getMonth());

        if (vm.availableMonths.indexOf(parseInt(vm.selectedMonthFilter)) === -1) {
          vm.selectedMonthFilter = defaultDate.getMonth().toString();
        }
      } else {
        for (var month = 0; month < 12; month++) {
          vm.availableMonths.push(month);
        }
      }
    }

    function fetchAndDownloadCSV(subject) {
      UserContacts.fetchAndDownloadActiveTeachersContacts(subject,
                                                          vm.selectedYearFilter,
                                                          vm.selectedMonthFilter,
                                                          vm.selectedCountryFilter);
    }
  }

  UserContactsController.$inject = ['UserContacts'];

  angular.module('dataDashboard.userContacts.controller.UserContactsController', [])
    .controller('UserContactsController', UserContactsController);
})();