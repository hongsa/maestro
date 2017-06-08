(function () {
  'use strict';
  function PiechartUtils(APP_CONFIG) {
    return {PieChartConfig: PieChartConfig};
    // constructor function for bar chart config
    function PieChartConfig(dataContainer, title, data) {
      var innerSize = '';
      if (title === undefined) {
        innerSize = '0%';
      } else {
        innerSize = '70%';
      }
      if (data !== undefined) {
        title = '<div style="font-size: 25px;font-weight: bold;">' + data.toString() + '</div>' + '<div style="font-size:17px;">' + title + '</div>';
      }

      this.options = {
        chart: {type: 'pie'},
        plotOptions: {
          pie: {
            size:'60%',
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            },
            showInLegend: true,
            innerSize : innerSize
          }
        },
        colors: APP_CONFIG.COLORS,
        tooltip: {
          headerFormat: '',
          pointFormat: '<b>{point.name}: {point.y} ({point.percentage:.1f}%)</b>'
        }
      };
      this.title = {
        align : 'center',
        verticalAlign: 'middle',
        floating: true,
        y : -20,
        useHTML : true,
        text : title,
        style : { 'fontSize': '18px'}
      };
      this.credits = {
        enabled: false
      },
      this.series = [{
        name: 'proportion',
        data: dataContainer
      }];
    }
  }

  PiechartUtils.$inject = ['APP_CONFIG'];
  angular.module('maestro.common.utils.PiechartUtils', []).factory('PiechartUtils', PiechartUtils);
}());