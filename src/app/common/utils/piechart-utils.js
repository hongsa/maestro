(function() {
  'use strict';

  function PiechartUtils(APP_CONFIG) {
    return {
      PieChartConfig: PieChartConfig
    };

    // constructor function for bar chart config
    function PieChartConfig(dataContainer) {
      this.options = {
        chart: {
          type: 'pie'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
          }
        },
        colors: APP_CONFIG.COLORS,
        tooltip: {
          headerFormat: '',
          pointFormat: '<b>{point.name}: {point.y} ({point.percentage:.1f}%)</b>'
        },
      };
      this.title = {
        text: null
      };
      this.series = [{
        name: 'proportion',
        data: dataContainer
      }];
    }
  }

  PiechartUtils.$inject = ['APP_CONFIG'];

  angular.module('dataDashboard.common.utils.PiechartUtils', [])
    .factory('PiechartUtils', PiechartUtils);
})();