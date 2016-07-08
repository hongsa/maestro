(function() {
  'use strict';

  var today = new Date(),
      defaultLineChartStartDate = new Date(new Date(today).setMonth(today.getMonth()-1)),
      dayInMS = 86400000,
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
    vm.availableDevices = ['android', 'ios'];

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
      name: 'Increasement',
      data: [],
      id: 'income',
      color: APP_CONFIG.COLORS[1]
    };

    vm.outcomeDataForLineChart = {
      name: 'Decreasement',
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

    vm.reversedIncomeData = [];
    vm.reversedOutcomeData = [];
    vm.reversedTotalData = [];
    vm.reversedDataContainer = [];

    vm.lineChartData = [
        //vm.incomeDataForLineChart,
        //vm.outcomeDataForLineChart,
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
      lineChartFilter();
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
      var lastDay,
          addDate = getAddDate(),
          key;

      vm.totalDataForLineChart.data.splice(0);

      for(var i = 0; i < vm.incomeDataForLineChart.data.length; i++) {

        var flag = false;
        for (var j = 0; j < vm.outcomeDataForLineChart.data.length; j++) {
          key = getTimeKey(vm.incomeDataForLineChart.data, i, addDate);
          if (vm.incomeDataForLineChart.data[i][0] === vm.outcomeDataForLineChart.data[j][0]) {
            vm.totalDataForLineChart.data.push([
              key,
              vm.incomeDataForLineChart.data[i][1] + vm.outcomeDataForLineChart.data[j][1]
            ]);
            flag = true;
          }
        }
        if (flag === false && vm.outcomeDataForLineChart.data.length !== 0) {
          if (vm.outcomeDataForLineChart.data[vm.outcomeDataForLineChart.data.length-1][0] < vm.incomeDataForLineChart.data[i][0]) {
            vm.totalDataForLineChart.data.push([
              key,
              vm.incomeDataForLineChart.data[i][1] + vm.outcomeDataForLineChart.data[vm.outcomeDataForLineChart.data.length-1][1]
            ]);
          } else if(vm.outcomeDataForLineChart.data[vm.outcomeDataForLineChart.data.length-1][0] > vm.incomeDataForLineChart.data[i][0]) {
            vm.totalDataForLineChart.data.push([
              key,
              vm.incomeDataForLineChart.data[i][1]
            ]);
          }
        } else if (flag === false && vm.outcomeDataForLineChart.data.length === 0) {
          vm.totalDataForLineChart.data.push([
            key,
            vm.incomeDataForLineChart.data[i][1]
          ]);
        }
      }

      lastDay = vm.incomeDataForLineChart.data[vm.incomeDataForLineChart.data.length-1][0];
      while (vm.outcomeDataForLineChart.data[vm.outcomeDataForLineChart.data.length-1][0] > lastDay) {
        vm.totalDataForLineChart.data.push([
          lastDay + dayInMS,
          vm.incomeDataForLineChart.data[vm.incomeDataForLineChart.data.length-1][1] + vm.outcomeDataForLineChart.data[vm.outcomeDataForLineChart.data.length-1][1]
        ]);
        lastDay += dayInMS
      }
      setReversedSumContainer();
    }

    function setReversedSumContainer() {
      var lastDay;

      vm.reversedIncomeData = vm.incomeDataForLineChart.data.slice();
      vm.reversedOutcomeData = vm.outcomeDataForLineChart.data.slice();
      vm.reversedTotalData = [];

      for (var i = 0; i < vm.reversedIncomeData.length; i++) {
        var flag = false;
        for (var j = 0; j < vm.reversedOutcomeData.length; j++) {
          if (vm.reversedOutcomeData[j][0] && vm.reversedIncomeData[i][0] === vm.reversedOutcomeData[j][0]) {
            vm.reversedTotalData.push([
              vm.reversedIncomeData[i][0],
              vm.reversedIncomeData[i][1],
              vm.reversedOutcomeData[j][1],
              vm.reversedIncomeData[i][1] + vm.reversedOutcomeData[j][1]
            ]);
            flag = true;
          }
        }
        if (flag === false && vm.reversedOutcomeData.length !== 0) {
          if (vm.reversedOutcomeData[vm.reversedOutcomeData.length-1][0] < vm.reversedIncomeData[i][0]) {
            vm.reversedTotalData.push([
              vm.reversedIncomeData[i][0],
              vm.reversedIncomeData[i][1],
              vm.reversedOutcomeData[vm.reversedOutcomeData.length-1][1],
              vm.reversedIncomeData[i][1] + vm.reversedOutcomeData[vm.reversedOutcomeData.length-1][1]
            ]);
          } else if (vm.reversedOutcomeData[vm.reversedOutcomeData.length-1][0] > vm.reversedIncomeData[i][0]) {
            vm.reversedTotalData.push([
              vm.reversedIncomeData[i][0],
              vm.reversedIncomeData[i][1],
              0,
              vm.reversedIncomeData[i][1]
            ]);
          }
        } else if (flag === false && vm.reversedOutcomeData.length === 0) {
          vm.reversedTotalData.push([
            vm.reversedIncomeData[i][0],
            vm.reversedIncomeData[i][1],
            0,
            vm.reversedIncomeData[i][1]
          ])
        }
      }

      lastDay = vm.reversedIncomeData[vm.reversedIncomeData.length-1][0];
      while(vm.reversedOutcomeData[vm.reversedOutcomeData.length-1][0] > lastDay) {
        vm.reversedTotalData.push([
          lastDay + dayInMS,
          vm.reversedIncomeData[vm.reversedIncomeData.length-1][1],
          vm.reversedOutcomeData[vm.reversedOutcomeData.length-1][1],
          vm.reversedIncomeData[vm.reversedIncomeData.length-1][1] + vm.reversedOutcomeData[vm.reversedOutcomeData.length-1][1]
        ]);
        lastDay += dayInMS
      }

      vm.reversedIncomeData = vm.reversedIncomeData.reverse();
      vm.reversedOutcomeData = vm.reversedOutcomeData.reverse();
      vm.reversedTotalData = vm.reversedTotalData.reverse();
      vm.totalItem = vm.reversedTotalData.length - 1;
      pageChanged(1);
    }

    function pageChanged(currentPage) {
      var addDate = getAddDate();
      var key;

      vm.currentPage = currentPage;
      vm.reversedDataContainer = [];
      var start = (vm.currentPage - 1) * vm.pageSize;
      for (var i = start; i < start + vm.pageSize; i++) {
        key = getTimeKey(vm.reversedTotalData, i, addDate);

        if (vm.reversedTotalData.length === 0) {
          break
        }
        if (i === vm.totalItem) {
          vm.reversedDataContainer.push([
            key,
            vm.reversedTotalData[i][1],
            vm.reversedTotalData[i][2],
            vm.reversedTotalData[i][3],
            '-'
          ]);
          break
        } else {
          vm.reversedDataContainer.push([
            key,
            vm.reversedTotalData[i][1],
            vm.reversedTotalData[i][2],
            vm.reversedTotalData[i][3],
            vm.reversedTotalData[i][3] - vm.reversedTotalData[i+1][3],
            vm.reversedTotalData[i][1] - vm.reversedTotalData[i+1][1],
            vm.reversedTotalData[i][2] - vm.reversedTotalData[i+1][2],
            (vm.reversedTotalData[i][3] - vm.reversedTotalData[i+1][3]) / (vm.reversedTotalData[i][3] || 1)
          ]);
        }
      }
    }

    function getTimeKey(dataContainer, i, addDate) {
      var key;
      if (vm.selectedRange === 'monthly') {
        key = new Date(new Date(dataContainer[i][0]).getFullYear(), new Date(dataContainer[i][0]).getMonth() + 1, 0, 23, 59, 59);
      } else {
        key = dataContainer[i][0] + (dayInMS * addDate)
      }
      return key
    }

    function getAddDate() {
      var addDate;
      if (vm.selectedRange === 'daily') {
        addDate = 0;
      } else if (vm.selectedRange === 'weekly') {
        addDate = 7
      } else if (vm.selectedRoleFilter === 'monthly') {
        addDate = 30
      } else {
        addDate = 265
      }
      return addDate
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
