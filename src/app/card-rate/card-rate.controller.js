(function() {
  'use strict';

  function CardRateController(CardRate, PiechartUtils, APP_CONFIG, CSVparserUtils, $filter) {
    var vm = this;

    vm.currentPage = 1;
    vm.pageSize = 20;
    vm.totalItem = 0;

    vm.selectedTypeFilter = 'all';

    vm.selectedMinRateCnt = 0;
    vm.selectedMaxRateCnt = 1000;

    vm.selectedMinAvgRate = 0;
    vm.selectedMaxAvgRate = 5;

    vm.selectedOrderBy = 'DESC';
    vm.selectedSortType = 'avg_rate';
    vm.selectedPublisherId = 0;
    vm.selectedSeriesId = 0;

    vm.availableTypes = ['official', 'extra'];

    vm.cardRates = [];
    vm.dataContainer = [];

    vm.getCardRate = getCardRate;
    vm.pageChanged = pageChanged;
    vm.fetchAndDownloadCSV = fetchAndDownloadCSV;
    vm.sortType = sortType;

    vm.pieChartConfig = new PiechartUtils.PieChartConfig(vm.pieChartData);

    init();

    function init() {
      getCardRate();
    }

    function getCardRate() {
      if (vm.selectedMinRateCnt >= 0 && vm.selectedMinRateCnt <= 1000 && vm.selectedMaxRateCnt >= 0 && vm.selectedMaxRateCnt <= 1000
      && vm.selectedMinAvgRate >= 0 && vm.selectedMinAvgRate <= 5 && vm.selectedMaxAvgRate >= 0 && vm.selectedMaxAvgRate <= 5) {
        CardRate.getCardRate(vm.cardRates,
                             vm.selectedMinAvgRate,
                             vm.selectedMaxAvgRate,
                             vm.selectedMinRateCnt,
                             vm.selectedMaxRateCnt,
                             vm.selectedTypeFilter,
                             vm.selectedPublisherId,
                             vm.selectedSeriesId).then(function (result) {
          if (result.name === 'success') {
            pageChanged(1)
          }
        });
      }
    }

    function fetchAndDownloadCSV(dataContainer) {
      var copyContainer = [],
          fields;
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
          'school_stats_' +
          vm.selectedPieChartFilter +
          '_count_proportion' + '.csv',
          fields,
          true);
    }


    function sortType(type) {
      vm.selectedSortType = type;
      if(vm.selectedOrderBy == 'DESC') {
        vm.selectedOrderBy = 'ASC';
      } else {
        vm.selectedOrderBy = 'DESC';
      }
      pageChanged(vm.currentPage)
    }

    function pageChanged(currentPage) {
      var sortable = vm.cardRates,
          orderFirst = 0,
          orderSecond = 0;

      if (vm.selectedOrderBy === 'ASC') {
        orderFirst = -1;
        orderSecond = 1
      } else {
        orderFirst = 1;
        orderSecond = -1
      }

      if (vm.selectedSortType === 'avg_rate') {
        sortable.sort(function(a,b) {
          return a.avg_rate < b.avg_rate ? orderFirst : a.avg_rate > b.avg_rate ? orderSecond : 0;
        });
      } else if (vm.selectedSortType === 'rate_cnt') {
        sortable.sort(function(a,b) {
          return a.rate_cnt > b.rate_cnt ? orderFirst : a.rate_cnt < b.rate_cnt ? orderSecond : 0;
        });
      } else if (vm.selectedSortType === 'series_id') {
        sortable.sort(function(a,b) {
          return a.series_id < b.series_id ? orderFirst : a.series_id > b.series_id ? orderSecond : 0;
        });
      } else if (vm.selectedSortType === 'publisher_id') {
        sortable.sort(function (a, b) {
          return a.publisher_id < b.publisher_id ? orderFirst : a.publisher_id > b.publisher_id ? orderSecond : 0;
        });
      } else if (vm.selectedSortType === 'card_id') {
        sortable.sort(function (a, b) {
          return a.id < b.id ? orderFirst : a.id > b.id ? orderSecond : 0;
        });
      } else if (vm.selectedSortType === 'grade_id') {
        sortable.sort(function (a, b) {
          return a.grade_id < b.grade_id ? orderFirst : a.grade_id > b.grade_id ? orderSecond : 0;
        });
      } else if (vm.selectedSortType === 'title') {
        sortable.sort(function (a, b) {
          return a.title < b.title ? orderFirst : a.title > b.title ? orderSecond : 0;
        });
      } else if (vm.selectedSortType === 'recc_end') {
        sortable.sort(function (a, b) {
          return a.recc_end < b.recc_end ? orderFirst : a.recc_end > b.recc_end ? orderSecond : 0;
        });
      }

      vm.currentPage = currentPage;
      vm.totalItem = vm.cardRates.length -1;
      vm.dataContainer = [];
      var start = (vm.currentPage - 1) * vm.pageSize;
      for (var i = start; i < start + vm.pageSize; i++) {
        if (i === vm.totalItem) {
          break;
        } else {
          if (sortable[i]['recc_end'] === null) {
            sortable[i]['recc_end'] = 0
          } else {
            sortable[i]['recc_end'] = new Date(sortable[i]['recc_end'])
          }

          vm.dataContainer.push([
            sortable[i]['id'],
            sortable[i]['title'],
            sortable[i]['avg_rate'],
            sortable[i]['rate_cnt'],
            sortable[i]['series_id'],
            sortable[i]['publisher_id'],
            sortable[i]['grade_id'],
            sortable[i]['curr_type'],
            sortable[i]['recc_end']
          ])
        }
      }
    }

  }

  CardRateController.$inject = ['CardRate','PiechartUtils', 'APP_CONFIG', 'CSVparserUtils', '$filter'];

  angular.module('dataDashboard.cardRate.controller.CardRateController', [])
    .controller('CardRateController', CardRateController);
})();
