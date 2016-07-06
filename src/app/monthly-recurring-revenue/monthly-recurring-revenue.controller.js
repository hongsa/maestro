(function() {
  'use strict';

  var today = new Date(),
      defaultLineChartStartDate = new Date(new Date(today).setMonth(today.getMonth()-1)),
      defaultPieChartStartDate = new Date('2015-11-01');

  function MonthlyRecurringRevenueController(NewPaidUserData, LinechartUtils, PiechartUtils, APP_CONFIG, $filter, CSVparserUtils) {
    var vm = this;

    vm.currentPage = 1;
    vm.pageSize = 20;
    vm.totalItem = 0;

    vm.dateRange = {
      startDate: defaultLineChartStartDate,
      endDate: today
    };

    vm.dateRangePieChart = {
      startDate: defaultPieChartStartDate,
      endDate: today
    };

    vm.availableRanges = ['daily', 'weekly', 'monthly', 'yearly'];
    vm.availableRoles = ['student', 'teacher', 'parent'];
    vm.availableDevices = ['android', 'ios', 'web'];

    vm.selectedRange = 'daily';
    vm.selectedType = 'User Signups';
    vm.selectedRoleFilter = 'all';
    vm.selectedDeviceFilter = 'all';
    vm.selectedPaidFilter = 'all';

    vm.currentTotalUsers = {
      value:0,
      first:0
    };

    // New Paid Line Chart
    vm.incomeDataForLineChart = {
      name: 'Income',
      data: [[new Date().getTime(), 0]],
      id: 'income',
      color: APP_CONFIG.COLORS[0]
    };

    vm.outcomeDataForLineChart = {
      name: 'Outcome',
      data: [[new Date().getTime(), 0]],
      id: 'outcome',
      color: APP_CONFIG.COLORS[1]
    };

    vm.totalDataForLineChart = {
      name: 'Total',
      data: [[new Date().getTime(), 0]],
      id: 'total',
      color: APP_CONFIG.COLORS[2]
    };

    vm.reversedData = [];
    vm.reversedDataContainer = [];

    vm.lineChartData = [
        vm.incomeDataForLineChart,
        vm.outcomeDataForLineChart,
        vm.totalDataForLineChart
    ];

    vm.lineChartConfig = new LinechartUtils.LineChartConfig(vm.lineChartData, null, true);

    vm.lineChartFilter = lineChartFilter;
    vm.selectDropdownRange = selectDropdownRange;
    vm.getDateColor = getDateColor;
    vm.getTableIndex = getTableIndex;
    vm.pageChanged = pageChanged;

    vm.fetchAndDownloadCSV = fetchAndDownloadCSV;

    init();

    function init() {
      //lineChartFilter();
      //getPieChart();
    }

    function getTableIndex(index) {
      return (vm.currentPage - 1) * vm.pageSize + index;
    }


    function lineChartFilter() {
        NewPaidUserData.getNewPaidUserData(vm.cumulativeUserDataForLineChart,
                                           vm.selectedLineChartFilter,
                                           vm.selectedRange,
                                           vm.selectedRoleFilter,
                                           vm.selectedDeviceFilter,
                                           vm.currentTotalUsers,
                                           vm.dateRange.startDate,
                                           vm.dateRange.endDate)
      }


    function setReversedSumContainer() {
      vm.reversedData = [];
    }

    function pageChanged(currentPage) {
      vm.currentPage = currentPage;
      vm.reversedCumulativeSumDataContainer = [];
      var start = (vm.currentPage - 1) * 20;
      for (var i = start; i < start + 20; i++) {
        if (vm.reversedData.length === 0) {
          break
        }
        if (i === vm.totalItem) {
          vm.reversedCumulativeSumDataContainer.push([
            vm.reversedData[i][0],
            vm.reversedData[i][1],
            vm.reversedData[i][2],
            vm.reversedData[i][3],
            vm.currentTotalUsers.first - vm.currentTotalDeleteUsers.first,
            vm.currentTotalUsers.first,
            vm.currentTotalDeleteUsers.first,
            '-'
          ]);
          break
        } else {
          vm.reversedCumulativeSumDataContainer.push([
            vm.reversedData[i][0],
            vm.reversedData[i][1],
            vm.reversedData[i][2],
            vm.reversedData[i][3],
            vm.reversedData[i][3] - vm.reversedData[i+1][3],
            vm.reversedData[i][1] - vm.reversedData[i+1][1],
            vm.reversedData[i][2] - vm.reversedData[i+1][2],
            (vm.reversedData[i][3] - vm.reversedData[i+1][3]) / vm.reversedData[i][3]
          ]);
        }
      }
    }

    function selectDropdownRange(range) {
      vm.selectedRange = range;
      lineChartFilter();
    }


    function fetchAndDownloadCSV(dataContainer) {
      var copyContainer = [],
          fields;
        fields = ['date', 'totalUsers', 'changeNet/%'];
        var prevData = dataContainer[0][3];
        dataContainer.forEach(function(item, i) {
          var changeNet = (prevData - item[3] );
          var percentage = ((prevData - item[3]) / prevData) * 100;

          var tmp = [];
          tmp[0] = item[0];
          tmp[1] = item[3];

          copyContainer.push(tmp);

          if (i === 0) {
            //pass
          } else {
            copyContainer[i-1][2] = changeNet.toString() + '/' + percentage.toFixed(2).toString() + '%';
          }

          prevData = item[3];
        });

        CSVparserUtils.downloadCSV2(copyContainer,
                                  false,
                                  'cumulative_userdata_' +
                                  vm.selectedRange +
                                  '_' + vm.selectedLineChartFilter + '.csv',
                                  fields);
    }


    function getDateColor(date) {
      date = getDateInNumbers(date);
      if (date === 6){
        return { 'color':'blue' };
      } else if (date === 0){
        return { 'color':'red' };
      } else {
        return { 'color':'black' };
      }
    }

    function getDateInNumbers(date) {
      var result = new Date(date);
      return result.getDay()
    }

  }

  MonthlyRecurringRevenueController.$inject = ['NewPaidUserData', 'LinechartUtils', 'PiechartUtils', 'APP_CONFIG', '$filter','CSVparserUtils'];

  angular.module('dataDashboard.monthlyRecurringRevenue.controller.MonthlyRecurringRevenueController', [])
    .controller('MonthlyRecurringRevenueController', MonthlyRecurringRevenueController);
})();
