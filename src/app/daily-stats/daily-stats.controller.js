(function () {
  'use strict';
  var today = new Date(), constraintDay = new Date(today.getTime());
  constraintDay.setDate(constraintDay.getDate() - 1);
  var lastWeek = new Date(constraintDay.getTime());
  lastWeek.setDate(lastWeek.getDate() - 6);
  function DailyStatsController(DailyStats, $timeout) {
    var vm = this, series, target, classStatsUpdateBtn, mobileStatsUpdateBtn, userStatsUpdateBtn, visitsStatsUpdateBtn, alertMsg, dateOverConstraint = 'You can\'t select date after ' + constraintDay.getFullYear() + '. ' + (constraintDay.getMonth() + 1) + '. ' + constraintDay.getDate(), dateOverRange = 'Please select date within a month range', aliases = {
        'new users': '#new-users',
        'new posts': '#new posts',
        'visits': '#visits'
      };
    vm.dateRange = {
      startDate: lastWeek,
      endDate: constraintDay
    };
    vm.alertMsgContent;
    vm.constraintDay = constraintDay;
    DailyStats.dateRange = vm.dateRange;
    vm.dataSubjects = Object.keys(aliases);
    vm.pieChartData = [{
        name: 'loading',
        y: 1
      }];
    vm.getPieChartTotal = getPieChartTotal;
    vm.getPieChartProportion = getPieChartProportion;
    vm.selectedPieSubject = 'new users';
    vm.selectPieDropdownSubject = selectPieDropdownSubject;
    vm.pieChartConfig = {
      options: {
        chart: { type: 'pie' },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
          }
        },
        tooltip: {
          headerFormat: '',
          pointFormat: '<b>{point.name}: {point.y} ({point.percentage:.1f}%)</b>'
        }
      },
      title: { text: null },
      series: [{
          name: 'proportion',
          data: vm.pieChartData
        }]
    };
    vm.piechart;
    vm.triggerUpdateWithDate = triggerUpdateWithDate;
    init();
    function init() {
      updateData();
    }
    function triggerUpdateWithDate() {
      if (!alertMsg) {
        alertMsg = angular.element('#date-alert-msg');
      }
      if (!classStatsUpdateBtn) {
        classStatsUpdateBtn = angular.element('#class-stats-update-btn');
      }
      if (!mobileStatsUpdateBtn) {
        mobileStatsUpdateBtn = angular.element('#post-stats-update-btn');
      }
      if (!userStatsUpdateBtn) {
        userStatsUpdateBtn = angular.element('#user-stats-update-btn');
      }
      if (!visitsStatsUpdateBtn) {
        visitsStatsUpdateBtn = angular.element('#visits-stats-update-btn');
      }
      if (vm.dateRange.endDate - vm.dateRange.startDate > 2678400000) {
        displayAlertMsg(dateOverRange);
      } else {
        alertMsg.addClass('hide');
        $timeout(function () {
          classStatsUpdateBtn.triggerHandler('click');
          mobileStatsUpdateBtn.triggerHandler('click');
          userStatsUpdateBtn.triggerHandler('click');
          visitsStatsUpdateBtn.triggerHandler('click');
        }, 0);
        updateData();
      }
    }
    function displayAlertMsg(msg) {
      vm.alertMsgContent = msg;
      alertMsg.removeClass('hide');
    }
    function updateData() {
      if (!alertMsg) {
        alertMsg = angular.element('#date-alert-msg');
      }
      if (vm.pieChartConfig.getHighcharts) {
        if (!vm.piechart) {
          vm.piechart = vm.pieChartConfig.getHighcharts();
        }
        vm.piechart.showLoading();
      }
      DailyStats.getRoleProportionData(vm.pieChartData, vm.selectedPieSubject, DailyStats.dateRange.startDate, DailyStats.dateRange.endDate, vm.piechart, displayAlertMsg);
    }
    function getPieChartTotal() {
      var total = 0;
      vm.pieChartData.forEach(function (data) {
        total += data.y;
      });
      return total;
    }
    function getPieChartProportion(data) {
      return data / vm.getPieChartTotal();
    }
    function selectPieDropdownSubject(subject) {
      vm.selectedPieSubject = subject;
      updateData();
    }
  }
  DailyStatsController.$inject = [
    'DailyStats',
    '$timeout'
  ];
  angular.module('dataDashboard.dailyStats.controller.DailyStatsController', []).controller('DailyStatsController', DailyStatsController);
}());