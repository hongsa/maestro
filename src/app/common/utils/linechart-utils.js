(function () {
  'use strict';
  function LinechartUtils(APP_CONFIG) {
    return {
      getAverage: getAverage,
      getMinimum: getMinimum,
      getMaximum: getMaximum,
      getSum: getSum,
      LineChartConfig: LineChartConfig,
      LineChartConfigForCSV: LineChartConfigForCSV,
      LineChartConfigForSES: LineChartConfigForSES
    };
    function getAverage(dataList) {
      if (dataList.length > 0) {
        return getSum(dataList) / dataList.length;
      }
    }
    function getMinimum(dataList) {
      if (dataList.length > 0) {
        return dataList.slice().sort(compareToSort)[0][1];
      }
    }
    function getMaximum(dataList) {
      if (dataList.length > 0) {
        return dataList.slice().sort(compareToSort)[dataList.length - 1][1];
      }
    }
    function getSum(dataList) {
      var sum = 0;
      if (dataList.length > 0) {
        dataList.forEach(function (e) {
          sum += e[1];
        });
      }
      return sum;
    }
    function compareToSort(itemA, itemB) {
      if (itemA[1] < itemB[1]) {
        return -1;
      } else if (itemA[1] > itemB[1]) {
        return 1;
      } else {
        return 0;
      }
    }
    function LineChartConfigForCSV(dataContainer, tooltipShared, legendFunc) {
      this.options = {
        chart: { type: 'line' },
        tooltip: {
          xDateFormat: '%A, %B %d, %Y',
          shared: tooltipShared || false,
          crosshairs: tooltipShared || false
        },
        plotOptions: {
          series: {
            events: {
              legendItemClick: legendFunc || function () {
              }
            }
          }
        },
        colors: APP_CONFIG.COLORS,
        loading: {
          labelStyle: { color: 'white' },
          style: { backgroundColor: 'gray' },
          hideDuration: 1000,
          showDuration: 1000
        }
      };
      this.title = { text: null };
      this.xAxis = { type: 'datetime' };
      this.yAxis = { title: null };
      this.series = dataContainer;
    }
    function LineChartConfigForSES(dataSeries, func) {
      this.options = {
        chart: {
          type: 'line',
          zoomType: 'x'
        },
        tooltip: { xDateFormat: '%H:%M, %A, %B %d, %Y' },
        plotOptions: {
          series: {
            events: {
              legendItemClick: func || function () {
              }
            },
            marker: { enabled: false }
          }
        },
        colors: APP_CONFIG.COLORS,
        loading: {
          labelStyle: { color: 'white' },
          style: { backgroundColor: 'gray' },
          hideDuration: 1000,
          showDuration: 1000
        }
      };
      this.title = { text: null };
      this.xAxis = { type: 'datetime' };
      this.yAxis = { title: null };
      this.series = dataSeries;
    }
    // constructor function for line chart config
    function LineChartConfig(dataSeries, func, tooltipShared, dateFormat) {
      this.options = {
        chart: { type: 'line' },
        tooltip: {
          xDateFormat: dateFormat || '%A, %B %d, %Y',
          shared: tooltipShared || false
        },
        plotOptions: {
          series: {
            events: {
              legendItemClick: func || function () {
              }
            }
          }
        },
        colors: APP_CONFIG.COLORS,
        loading: {
          labelStyle: { color: 'white' },
          style: { backgroundColor: 'gray' },
          hideDuration: 1000,
          showDuration: 1000
        }
      };
      this.title = { text: null };
      this.xAxis = { type: 'datetime' };
      this.yAxis = { title: null };
      this.series = dataSeries;
    }
  }
  LinechartUtils.$inject = ['APP_CONFIG'];
  angular.module('maestro.common.utils.LinechartUtils', []).factory('LinechartUtils', LinechartUtils);
}());