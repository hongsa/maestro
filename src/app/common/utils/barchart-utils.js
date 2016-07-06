(function() {
  'use strict';

  function BarchartUtils(APP_CONFIG) {
    return {
      BarChartConfig: BarChartConfig
    };

    // constructor function for bar chart config
    function BarChartConfig(dataSeries, func, tooltipShared, dateFormat, stackingOpt) {
      this.options = {
        chart: {
          type: 'column'
        },
        tooltip: {
          xDateFormat: dateFormat || '%A, %B %d, %Y',
          shared: tooltipShared || false
        },
        plotOptions: {
          series: {
            legendItemClick: func,
            stacking: stackingOpt
          }
        },
        colors: APP_CONFIG.COLORS,
        loading: {
          labelStyle: {
            color: 'white'
          },
          style: {
            backgroundColor: 'gray'
          },
          hideDuration: 1000,
          showDuration: 1000
        }
      };
      this.title = {
        text: null
      };
      this.xAxis = {
        type: 'datetime'
      };
      this.yAxis = {
        title: null
      };
      this.series = dataSeries;
    }
  }

  BarchartUtils.$inject = ['APP_CONFIG'];

  angular.module('dataDashboard.common.utils.BarchartUtils', [])
    .factory('BarchartUtils', BarchartUtils);
})();