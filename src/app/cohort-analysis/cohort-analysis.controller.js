(function() {
  'use strict';

  var today = new Date(),
      defaultStartDate = new Date(new Date(today).setMonth(today.getMonth()-1));


  function CohortAnalysisController(CohortAnalysis, DUMMY4) {
    var vm = this;

    vm.dateRange = {
      startDate: defaultStartDate,
      endDate: today
    };

    vm.heatmapChartConfig = {
      options: {
        chart: {
          type: 'heatmap'
        },
        colorAxis: {
            min: 0,
            minColor: '#90CAF9',
            maxColor: '#0D47A1'
        },
        tooltip: {
          formatter: function () {
            return 'Users those who signed up<br>on <b>' + this.series.yAxis.categories[this.point.y] + '</b> are<br>remained by <b>' +
              this.point.value + '%</b> after <b>' + this.series.xAxis.categories[this.point.x] + '</b>';
          }
        }
      },
      title: {
        text: null
      },
      xAxis: {
        categories: makeDaysArray(7)
      },

      yAxis: {
        categories: makeDateArray(7),
        title: null
      },
      series: [{
        name: 'Sales per employee',
        borderWidth: 1,
        dataLabels: {
          enabled: true,
          format: '{point.value}%',
          style: {
            textShadow: 'none'
          }
        },
        data: [
          [0, 0, 2.91],
          [0, 1, 2.89],
          [0, 2, 2.83],
          [0, 3, 1.86],
          [0, 4, 3.14],
          [0, 5, 4.21],
          [0, 6, 3.21],
          [1, 0, 1.32],
          [1, 1, 0.81],
          [1, 2, 1.06],
          [1, 3, 2.62],
          [1, 4, 1.15],
          [1, 5, 2.15],
          [2, 0, 0.79],
          [2, 1, 0.20],
          [2, 2, 2.12],
          [2, 3, 2.09],
          [2, 4, 1.09],
          [3, 0, 0.53],
          [3, 1, 1.41],
          [3, 2, 1.06],
          [3, 3, 1.46],
          [4, 0, 1.32],
          [4, 1, 0.20],
          [4, 2, 0.50],
          [5, 0, 1.33],
          [5, 1, 0.93],
          [6, 0, 0.53]
        ]
      }]
    };

    vm.availableRanges = ['daily','weekly', 'monthly', 'yearly'];
    vm.availableStandard = ['conversion rate', 'churn rate'];

    vm.selectedRange = 'daily';
    vm.selectedStandard = 'conversion rate';

    function getPrevDay(today) {
      var prev = new Date(today.getTime());
      prev.setDate(prev.getDate()-1);
      return prev;
    }

    function makeDateArray(length) {
      var today = new Date(),
          week = [today];
      for (var i=0; i < length; i++) {
        week.unshift(getPrevDay(week[0]));
      }
      return week.map(function(day) {
        return day.toDateString();
      });
    }

    function makeDaysArray(length) {
      var days = [];
      for (var i=1; i <= length; i++) {
        days.push('Day ' + i);
      }
      return days;
    }
  }

  CohortAnalysisController.$inject = ['CohortAnalysis', 'DUMMY4'];

  angular.module('dataDashboard.cohortAnalysis.controller.CohortAnalysisController', [])
    .controller('CohortAnalysisController', CohortAnalysisController);
})();
