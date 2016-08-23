(function () {
  'use strict';
  function MobileStoreStatsController(MobileStoreStats, LinechartUtils, CSVparserUtils, $timeout) {
    var vm = this;
    var refDate = new Date();
    var minimumYear = 2015;
    var defaultYear = refDate.getMonth() === 0 ? refDate.getFullYear() - 1 : refDate.getFullYear();
    var androidDailyDeviceStatsUpdateBtn;
    var androidDailyUserStatsUpdateBtn;
    var androidCumulativeStatsUpdateBtn;
    var androidLanguageStatsUpdateBtn;
    var androidCountryStatsUpdateBtn;
    vm.availableMonths = [
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12'
    ];
    vm.availableYears = [];
    vm.monthNames = {
      '01': 'January',
      '02': 'February',
      '03': 'March',
      '04': 'April',
      '05': 'May',
      '06': 'June',
      '07': 'July',
      '08': 'August',
      '09': 'September',
      '10': 'October',
      '11': 'November',
      '12': 'December'
    };
    vm.availableDownloadOptions = [
      'Android Installs Overview',
      'Android Installs by Languages',
      'Android Installs by Countries'
    ];
    vm.selectedYear = defaultYear;
    vm.selectedMonth = getDefaultMonth();
    vm.triggerUpdateForNewInstallsOverviewCSV = triggerUpdateForNewInstallsOverviewCSV;
    vm.updateDataWithNewYearMonth = updateDataWithNewYearMonth;
    vm.selectDropdownMonth = selectDropdownMonth;
    vm.selectDropdownYear = selectDropdownYear;
    vm.csvData = {
      androidInstallsOverview: null,
      androidLanguageStats: null,
      androidCountryStats: null
    };
    vm.fetchAndDownloadCSV = fetchAndDownloadCSV;
    init();
    function init() {
      addAvailableYears();
      MobileStoreStats.getAndroidInstallsOverviewStats(vm.csvData, getYearMonthString(), triggerUpdateForNewInstallsOverviewCSV);
      MobileStoreStats.getAndroidLanguageStats(vm.csvData, getYearMonthString(), triggerUpdateForNewLanguageCSV);
      MobileStoreStats.getAndroidCountryStats(vm.csvData, getYearMonthString(), triggerUpdateForNewCountryCSV);
    }
    function fetchAndDownloadCSV(selectedSubject) {
      if (selectedSubject === 'Android Installs Overview') {
        MobileStoreStats.getAndroidInstallsOverviewStats(null, getYearMonthString(), CSVparserUtils.downloadCSV);
      } else if (selectedSubject === 'Android Installs by Languages') {
        MobileStoreStats.getAndroidLanguageStats(null, getYearMonthString(), CSVparserUtils.downloadCSV);
      } else if (selectedSubject === 'Android Installs by Countries') {
        MobileStoreStats.getAndroidCountryStats(null, getYearMonthString(), CSVparserUtils.downloadCSV);
      }
    }
    function updateDataWithNewYearMonth() {
      MobileStoreStats.getAndroidInstallsOverviewStats(vm.csvData, getYearMonthString(), triggerUpdateForNewInstallsOverviewCSV);
      MobileStoreStats.getAndroidLanguageStats(vm.csvData, getYearMonthString(), triggerUpdateForNewLanguageCSV);
      MobileStoreStats.getAndroidCountryStats(vm.csvData, getYearMonthString(), triggerUpdateForNewCountryCSV);
    }
    function triggerUpdateForNewInstallsOverviewCSV() {
      if (!androidDailyDeviceStatsUpdateBtn) {
        androidDailyDeviceStatsUpdateBtn = angular.element('#android-daily-device-stats-update-btn');
      }
      if (!androidDailyUserStatsUpdateBtn) {
        androidDailyUserStatsUpdateBtn = angular.element('#android-daily-user-stats-update-btn');
      }
      if (!androidCumulativeStatsUpdateBtn) {
        androidCumulativeStatsUpdateBtn = angular.element('#android-cumulative-stats-update-btn');
      }
      $timeout(function () {
        androidDailyDeviceStatsUpdateBtn.triggerHandler('click');
        androidDailyUserStatsUpdateBtn.triggerHandler('click');
        androidCumulativeStatsUpdateBtn.triggerHandler('click');
      }, 0);
    }
    function triggerUpdateForNewLanguageCSV() {
      if (!androidLanguageStatsUpdateBtn) {
        androidLanguageStatsUpdateBtn = angular.element('#android-language-stats-update-btn');
      }
      $timeout(function () {
        androidLanguageStatsUpdateBtn.triggerHandler('click');
      }, 0);
    }
    function triggerUpdateForNewCountryCSV() {
      if (!androidCountryStatsUpdateBtn) {
        androidCountryStatsUpdateBtn = angular.element('#android-country-stats-update-btn');
      }
      $timeout(function () {
        androidCountryStatsUpdateBtn.triggerHandler('click');
      }, 0);
    }
    function getYearMonthString() {
      return vm.selectedYear.toString() + vm.selectedMonth;
    }
    function getDefaultMonth() {
      var lastMonth = refDate.getMonth();
      if (lastMonth === 0) {
        lastMonth = 12;
      }
      return lastMonth < 10 ? '0' + lastMonth.toString() : lastMonth.toString();
    }
    function addAvailableYears() {
      var yearToAdd = defaultYear;
      while (yearToAdd > minimumYear) {
        vm.availableYears.unshift(yearToAdd);
        yearToAdd--;
      }
      vm.availableYears.unshift(minimumYear);
    }
    function selectDropdownMonth(month) {
      vm.selectedMonth = month;
    }
    function selectDropdownYear(year) {
      vm.selectedYear = year;
    }
  }
  MobileStoreStatsController.$inject = [
    'MobileStoreStats',
    'LinechartUtils',
    'CSVparserUtils',
    '$timeout'
  ];
  angular.module('dataDashboard.mobileStoreStats.controller.MobileStoreStatsController', []).controller('MobileStoreStatsController', MobileStoreStatsController);
}());