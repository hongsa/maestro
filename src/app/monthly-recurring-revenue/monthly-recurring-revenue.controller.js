(function() {
  'use strict';

  var today = new Date(),
      defaultLineChartStartDate = new Date(new Date(today).setMonth(today.getMonth()-1)),
      defaultPieChartStartDate = new Date('2015-11-01');

  function MonthlyRecurringRevenueController(MonthlyRecurringRevenue, LinechartUtils, PiechartUtils, APP_CONFIG, $filter, CSVparserUtils) {
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

    vm.paymentTypeLoop = [
        [0, 1, 19800],
        [0, 2, 29800],
        [0, 3, 49800],
        [1, 2, 10000],
        [1, 3, 30000],
        [2, 3, 20000]
    ];

    vm.keyList = {};

    // New Paid Line Chart
    vm.incomeDataForLineChart = {
      name: 'Income',
      data: [],
      id: 'income',
      color: APP_CONFIG.COLORS[1]
    };

    vm.outcomeDataForLineChart = {
      name: 'Outcome',
      data: [],
      id: 'outcome',
      color: APP_CONFIG.COLORS[0]
    };

    vm.totalDataForLineChart = {
      name: 'Total',
      data: [],
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
        MonthlyRecurringRevenue.getMRR(vm.incomeDataForLineChart,
                                       vm.paymentTypeLoop,
                                       vm.selectedRange,
                                       vm.selectedDeviceFilter,
                                       vm.dateRange.startDate,
                                       vm.dateRange.endDate).then(function (result) {
          if (result.length === 6) {
            MonthlyRecurringRevenue.getMRR(vm.outcomeDataForLineChart,
                                         vm.paymentTypeLoop,
                                         vm.selectedRange,
                                         vm.selectedDeviceFilter,
                                         vm.dateRange.startDate,
                                         vm.dateRange.endDate).then(function(result) {

              if (result.length === 6) {
                sumData();
              }
            })
          }
        })
    }

    function sumData() {
      var lastDay;
      vm.totalDataForLineChart.data.splice(0)

      for(var i = 0; i < vm.incomeDataForLineChart.data.length; i++) {
        var flag = false;
        for (var j = 0; j < vm.outcomeDataForLineChart.data.length; j++) {
          if (vm.incomeDataForLineChart.data[i][0] === vm.outcomeDataForLineChart.data[j][0]) {
            vm.totalDataForLineChart.data.push([
              vm.incomeDataForLineChart.data[i][0],
              vm.incomeDataForLineChart.data[i][1] - vm.outcomeDataForLineChart.data[j][1]
            ]);
            flag = true;
          }
        }
        if (flag === false && vm.outcomeDataForLineChart.data.length !== 0) {
          if (vm.outcomeDataForLineChart.data[vm.outcomeDataForLineChart.data.length-1][0] < vm.incomeDataForLineChart.data[i][0]) {
            vm.totalDataForLineChart.data.push([
              vm.incomeDataForLineChart.data[i][0],
              vm.incomeDataForLineChart.data[i][1] - vm.outcomeDataForLineChart.data[vm.outcomeDataForLineChart.data.length-1][1]
            ]);
          } else if(vm.outcomeDataForLineChart.data[vm.outcomeDataForLineChart.data.length-1][0] > vm.incomeDataForLineChart.data[i][0]) {
            vm.totalDataForLineChart.data.push([
              vm.incomeDataForLineChart.data[i][0],
              vm.incomeDataForLineChart.data[i][1]
            ]);
          }
        } else if (flag === false && vm.outcomeDataForLineChart.data.length === 0) {
          vm.totalDataForLineChart.data.push([
            vm.incomeDataForLineChart.data[i][0],
            vm.incomeDataForLineChart.data[i][1]
          ]);
        }
      }

      lastDay = vm.incomeDataForLineChart.data[vm.incomeDataForLineChart.data.length-1][0];
      while (vm.outcomeDataForLineChart.data[vm.outcomeDataForLineChart.data.length-1][0] > lastDay) {
        vm.totalDataForLineChart.data.push([
          lastDay + dayInMS,
          vm.incomeDataForLineChart.data[vm.incomeDataForLineChart.data.length-1][1] - vm.outcomeDataForLineChart.data[vm.outcomeDataForLineChart.data.length-1][1]
        ]);
        lastDay += dayInMS
      }
      setReversedSumContainer();


    }

    function setReversedSumContainer() {
      vm.reversedData = [];
    }

    function sortNumber(a,b) {
      return a - b;
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

  MonthlyRecurringRevenueController.$inject = ['MonthlyRecurringRevenue', 'LinechartUtils', 'PiechartUtils', 'APP_CONFIG', '$filter','CSVparserUtils'];

  angular.module('dataDashboard.monthlyRecurringRevenue.controller.MonthlyRecurringRevenueController', [])
    .controller('MonthlyRecurringRevenueController', MonthlyRecurringRevenueController);
})();
