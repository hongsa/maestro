(function() {
  'use strict';

  var today = new Date(),
      defaultStartDate = new Date(new Date(today).setMonth(today.getMonth()-1));

  function NewCancelUserDataController(NewCancelUserData, LinechartUtils, PiechartUtils, APP_CONFIG, $filter, CSVparserUtils) {
    var vm = this;

    vm.currentPage = 1;
    vm.pageSize = 20;
    vm.totalItem = 0;

    vm.dateRange = {
      startDate: defaultStartDate,
      endDate: today
    };

    vm.dateRangePieChart = {
      startDate: defaultStartDate,
      endDate: today
    };

    vm.availableRanges = ['daily', 'weekly', 'monthly', 'yearly'];
    vm.availableRoles = ['student', 'teacher', 'parent'];
    vm.availableDevices = ['android', 'ios'];
    vm.availablePieChartFilters = ['type'];

    vm.selectedLineChartFilter = 'all';
    vm.selectedPieChartFilter = 'type';

    vm.selectedRange = 'daily';
    vm.selectedRoleFilter = 'all';
    vm.selectedDeviceFilter = 'all';
    vm.selectedPaidFilter = 'all';

    // New Cancel Line Chart
    vm.basicToFreeUserDataForLineChart = {
      name: 'Basic to Free',
      data: [[new Date().getTime(), 0]],
      id: 'basic-free',
      color: APP_CONFIG.COLORS[0]
    };

    vm.standardToFreeUserDataForLineChart = {
      name: 'Standard to Free',
      data: [[new Date().getTime(), 0]],
      id: 'standard-free',
      color: APP_CONFIG.COLORS[1]
    };

    vm.premiumToFreeUserDataForLineChart = {
      name: 'Premium to Free',
      data: [[new Date().getTime(), 0]],
      id: 'premium-free',
      color: APP_CONFIG.COLORS[2]
    };

    // Upgrade Cancel Line Chart
    vm.standardToBasicUserDataForLineChart = {
      name: 'Standard to Basic',
      data: [[new Date().getTime(), 0]],
      id: 'standard-basic',
      color: APP_CONFIG.COLORS[3]
    };

    vm.premiumToStandardUserDataForLineChart = {
      name: 'Premium to Standard',
      data: [[new Date().getTime(), 0]],
      id: 'premium-standard',
      color: APP_CONFIG.COLORS[4]
    };

    vm.premiumToBasicUserDataForLineChart = {
      name: 'Premium to Basic',
      data: [[new Date().getTime(), 0]],
      id: 'premium-basic',
      color: APP_CONFIG.COLORS[5]
    };

    vm.lineChartDataLoop = [
      vm.basicToFreeUserDataForLineChart,
      vm.standardToFreeUserDataForLineChart,
      vm.premiumToFreeUserDataForLineChart,
      vm.standardToBasicUserDataForLineChart,
      vm.premiumToStandardUserDataForLineChart,
      vm.premiumToBasicUserDataForLineChart
    ];

    vm.reversedData = [];
    vm.reversedDataContainer = [];

    vm.lineChartCancelData = [
        vm.basicToFreeUserDataForLineChart,
        vm.standardToFreeUserDataForLineChart,
        vm.premiumToFreeUserDataForLineChart,
    ];

    vm.lineChartDowngradeData = [
      vm.standardToBasicUserDataForLineChart,
      vm.premiumToStandardUserDataForLineChart,
      vm.premiumToBasicUserDataForLineChart,
    ];

    vm.lineChartCancelDataConfig = new LinechartUtils.LineChartConfig(vm.lineChartCancelData, null, true);
    vm.lineChartDowngradeDataConfig = new LinechartUtils.LineChartConfig(vm.lineChartDowngradeData, null, true);

    vm.lineChartFilter = lineChartFilter;
    vm.getPieChart = getPieChart;
    vm.selectDropdownRange = selectDropdownRange;
    vm.getDateColor = getDateColor;
    vm.getTableIndex = getTableIndex;
    vm.pageChanged = pageChanged;

    // Pie Chart
    vm.pieChartData = [{
      name: 'User Signups',
      y: 1
    }];

    vm.pieChartConfig = new PiechartUtils.PieChartConfig(vm.pieChartData);

    vm.pieChartFilter = pieChartFilter;
    vm.getPieChartProportion = getPieChartProportion;
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
      var count = 0;
      vm.lineChartDataLoop.forEach(function (dataContainer) {
        NewCancelUserData.getNewCancelData(dataContainer,
                                         vm.selectedRange,
                                         vm.selectedRoleFilter,
                                         vm.selectedDeviceFilter,
                                         vm.dateRange.startDate,
                                         vm.dateRange.endDate).then(function (result) {
          if(result.name === 'success') {
            count+=1;
            if (count === 6 ) {
              concatContainer();
            }
          }
        });
      });
    }

    function concatContainer() {
      vm.reversedData = [];
      for(var i = 0; i < vm.basicToFreeUserDataForLineChart.data.length; i++) {
        vm.reversedData.push([
          vm.basicToFreeUserDataForLineChart.data[i][0],
          vm.basicToFreeUserDataForLineChart.data[i][1],
          vm.standardToFreeUserDataForLineChart.data[i][1],
          vm.premiumToFreeUserDataForLineChart.data[i][1],
          vm.standardToBasicUserDataForLineChart.data[i][1],
          vm.premiumToStandardUserDataForLineChart.data[i][1],
          vm.premiumToBasicUserDataForLineChart.data[i][1]
        ])
      }
      vm.reversedData.reverse();
      vm.totalItem = vm.reversedData.length - 1;
      pageChanged(1);
    }

    function pageChanged(currentPage) {
      vm.currentPage = currentPage;
      vm.reversedDataContainer = [];
      var start = (vm.currentPage - 1) * 20;
      for (var i = start; i < start + 20; i++) {
        if (vm.reversedData.length === 0) {
          break
        }
        if (i === vm.totalItem) {
          vm.reversedDataContainer.push([
            vm.reversedData[i][0],
            vm.reversedData[i][1],
            vm.reversedData[i][1],
            vm.reversedData[i][2],
            vm.reversedData[i][3],
            vm.reversedData[i][4],
            vm.reversedData[i][5],
            vm.reversedData[i][6]
          ]);
          break
        } else {
          vm.reversedDataContainer.push([
            vm.reversedData[i][0],
            vm.reversedData[i][1],
            vm.reversedData[i][2],
            vm.reversedData[i][3],
            vm.reversedData[i][4],
            vm.reversedData[i][5],
            vm.reversedData[i][6]
          ]);
        }
      }
    }

    function selectDropdownRange(range) {
      vm.selectedRange = range;
      lineChartFilter();
    }

    function getPieChart() {
      NewCancelUserData.getNewPaidProportionData(vm.pieChartData,
          vm.selectedPieChartFilter,
          vm.dateRangePieChart.startDate,
          vm.dateRangePieChart.endDate,
          vm.currentPieChartUsers,
          vm.availableTypes[0])
    }

    function pieChartFilter(selectedFilter) {
      vm.selectedPieChartFilter = selectedFilter;
      getPieChart();
    }

    function getPieChartTotal() {
      var total = 0;
      vm.pieChartSumData.forEach(function(data) {
        total += data.y;
      });
      return total;
    }

    function getPieChartProportion(data) {
      return data / getPieChartTotal();
    }

    function fetchAndDownloadCSV(dataContainer, type) {
      var copyContainer = [],
          fields;
      if (type === 'LineChart') {
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
      // PieChart
      } else {
        fields = [vm.selectedPieChartFilter, 'count', 'proportion'];
        dataContainer.forEach(function(item) {
          var tmp = [];
          tmp[0] = item.name;
          tmp[1] = item.y;
          tmp[2] = (getPieChartProportion(item.y) * 100).toFixed(1).toString() + '%';
          copyContainer.push(tmp);
        });

        CSVparserUtils.downloadCSV2(copyContainer,
                                  false,
                                  'cumulative_userdata_' +
                                  vm.selectedPieChartFilter +
                                  '_count_proportion' + '.csv',
                                  fields);
      }
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

  NewCancelUserDataController.$inject = ['NewCancelUserData', 'LinechartUtils', 'PiechartUtils', 'APP_CONFIG', '$filter','CSVparserUtils'];

  angular.module('dataDashboard.newCancelUserData.controller.NewCancelUserDataController', [])
    .controller('NewCancelUserDataController', NewCancelUserDataController);
})();
