(function() {
  'use strict';

  var today = new Date(),
      constraintDay = new Date(today.getTime());

  constraintDay.setDate(constraintDay.getDate()-1);

  var fiveDaysPast = new Date(constraintDay.getTime());
  fiveDaysPast.setDate(fiveDaysPast.getDate() - 5);

  function CustomQueryController(CustomQuery, LinechartUtils, CSVparserUtils, APP_CONFIG) {
    var vm = this,
        defaultData,
        alertMsg,
        dateOverConstraint = "You can't select date after " + constraintDay.getFullYear() + '. ' + (constraintDay.getMonth()+1) + '. ' + constraintDay.getDate(),
        dateOverRange = 'Please select date within a month range',
        invalidGroupBy = 'Please use count() function with GROUP BY';

    vm.dateRange = {
      startDate: fiveDaysPast,
      endDate: constraintDay
    };
    vm.alertMsgContent;
    vm.constraintDay = constraintDay;

    vm.getAverage = LinechartUtils.getAverage;
    vm.getMinimum = LinechartUtils.getMinimum;
    vm.getMaximum = LinechartUtils.getMaximum;
    vm.getSum = LinechartUtils.getSum;

    vm.customQueryString = '';
    vm.lastGroupByAggregation = {
      value: null
    };
    vm.dataFetched = {
      value: false
    };

    vm.selectedLogTypeFilter = 'page';
    vm.selectedGroupByFilter = 'date';
    vm.selectedChartType = 'line';
    vm.selectedCountRowsFilter = 'yes';
    vm.selectedQueryParams = {
      serverapi: {
        api: 'All',
        device: 'All',
        method: 'All',
        role: 'All'
      },
      page: {
        device: 'All',
        role: 'All',
        cur_page : 'All',
        prev_page : 'All'
      },
      result: {
        device: 'All',
        role: 'All',
        rate: 'All'
      },
      quizevent: {
        device: 'All',
        role: 'All',
        is_correct : 'All'
      },
      event: {
        device: 'All',
        role: 'All'
      },
      payment: {
        device: 'All',
        role: 'All'
      },
      download: {
        device: 'All',
        role: 'All',
        view_type: 'All'
      }
    };

    vm.availableLogTypes = ['page', 'result', 'quizevent', 'event', 'serverapi', 'payment', 'download'];
    vm.availableAPIs = ['users', 'classes', 'posts', 'comments', 'token', 'notices', 'photos', 'albums', 'upload', 'search', 'stickers', 'advertisements'];
    vm.availableMethods = ['All', 'GET', 'POST', 'PUT', 'DELETE'];
    vm.availableRoles = ['All', 'child', 'parent'];
    vm.availableDevices = ['All', 'Android', 'iOS'];
    vm.availableViewTypes = ['All', 'download', 'streaming'];
    vm.availablePages = ['All', '랜딩 화면','러닝카드 시작하기','Reset PW','Reset PW New PW', '가입', '이용약관', '가입시 역할 선택', '가입시 학년 선택', '가입시 과목 선택', '가입시 부모 등록', '체험 시작 안내', '투데이 추천', '추천 카드 변경', '카드 표지', '카드 시트', '퀴즈', '퀴즈 해설', '카드 평가', '마일스톤', '카드 결과', '카드 메뉴', '카드 정보', '카드 출처', '카드 저작자 정보', '시리즈', '에디터 상세 페이지', '탐색', '인기 카드 목록', '과목별 시리즈 목록', '검색', '성취도', '목표달성', '이전 성취도', '프로필', '프로필 수정', '학교 검색', '학년 선택', '과목 선택', 'profile.subject_detail', '즐겨찾기 카드', '완료한 카드', '설정', '이메일 변경 modal', '이름 변경', '비밀번호 변경', '추천카드 알람', '알람 시간', '다운로드된 카드', '공지사항', '고객지원', '탈퇴', '구독정보', '학부모 대시보드', '자녀 설정', '자녀 성취도', '부모 설정', 'parent_settings.invite_child', '부모 계정 설정', '플랜 선택', '결제 정보', '결제 정보 수정', '구독 해지', '환불 신청', '결제 완료', '구독할 자녀 선택', 'payment.detail', '없음']
    vm.availableRates = ['All', -1,0.5,1,1.5,2,2.5,3,3.5,4,4.5,5];
    vm.availableCountRows = ['yes', 'no'];
    vm.availableChartTypes = ['line', 'area', 'bar', 'column', 'pie', 'scatter', 'table'];
    vm.availableGroupBys = {
      serverapi: ['date', 'role', 'device', 'method', 'code', 'ID'],
      result: ['date', 'role', 'device', 'ID'],
      quizevent: ['date', 'role', 'device', 'ID'],
      page: ['date', 'role', 'device', 'ID'],
      event: ['date', 'role', 'device', 'ID'],
      payment: ['date', 'role', 'device', 'ID'],
      download: ['date', 'role', 'device', 'ID']
    };

    vm.noCountTableContainer = {
      headers: [],
      data: [],
      slicedData: [],
      offset: 0,
      total: 0,
      pageSize: 10,
      visible: false
    };

    vm.dataContainer = {
      name: 'custom query',
      data: [[vm.dateRange.endDate.getTime(), 0]],
      slicedData: [],
      offset: 0,
      total: 0,
      pageSize: 10,
      id: 'dataContainer',
      color: APP_CONFIG.COLORS[1]
    };

    vm.lineChartData = [
      vm.dataContainer
    ];

    vm.lineChartConfig = new LinechartUtils.LineChartConfig(vm.lineChartData);
    vm.linechart;

    vm.selectDateRange = selectDateRange;

    vm.triggerUpdateWithQueryString = triggerUpdateWithQueryString;
    vm.updateCustomQueryString = updateCustomQueryString;
    vm.updateChartType = updateChartType;
    vm.updateData = updateData;

    vm.getChartAreaType = getChartAreaType;

    vm.tablePageChanged = tablePageChanged;
    vm.noCountTablePageChanged = noCountTablePageChanged;

    vm.downloadCSV = downloadCSV;

    init();

    function init() {
      updateCustomQueryString();
    }

    function tablePageChanged(currentPage) {
      vm.dataContainer.offset = (currentPage - 1) * vm.dataContainer.pageSize;
      vm.dataContainer.slicedData = vm.dataContainer.data.slice(vm.dataContainer.offset, vm.dataContainer.offset + vm.dataContainer.pageSize);
    }

    function noCountTablePageChanged(currentPage) {
      vm.noCountTableContainer.offset = (currentPage - 1) * vm.noCountTableContainer.pageSize;
      vm.noCountTableContainer.slicedData = vm.noCountTableContainer.data.slice(vm.noCountTableContainer.offset, vm.noCountTableContainer.offset + vm.noCountTableContainer.pageSize);
    }

    function updateChartType() {
      if (vm.selectedChartType !== 'table') {
        vm.lineChartConfig.options.chart.type = vm.selectedChartType;
      }
    }

    function selectDropdownChartType(type) {
      vm.selectedChartType = type;
      if (vm.selectedChartType !== 'table') {
        vm.lineChartConfig.options.chart.type = type;
      }
    }

    function getChartAreaType() {
      if (vm.noCountTableContainer.visible) {
        return 'noCount';
      } else if (vm.selectedChartType !== 'table') {
        return 'chart';
      } else {
        return 'table';
      }
    }

    function selectDateRange() {
      updateCustomQueryString();
    }

    function switchAxisType() {
      var groupByFilter = CustomQuery.getGroupByFilterFromQuery(vm.customQueryString);

      if (groupByFilter === null) {
        vm.lineChartConfig.xAxis.type = 'category';
      } else if (groupByFilter.startsWith('date_histogram')) {
        vm.lineChartConfig.xAxis.type = 'datetime';
      } else {
        vm.lineChartConfig.xAxis.type = 'category';
      }
    }

    function updateCustomQueryString() {
      if (vm.selectedCountRowsFilter === 'no') {
        vm.selectedGroupByFilter = 'none';
      }

      vm.customQueryString = CustomQuery.createQueryString(vm.selectedLogTypeFilter,
                                                           vm.selectedCountRowsFilter,
                                                           vm.selectedGroupByFilter,
                                                           vm.selectedQueryParams[vm.selectedLogTypeFilter],
                                                           vm.dateRange.startDate,
                                                           vm.dateRange.endDate);
    }

    function triggerUpdateWithQueryString() {
      if (!alertMsg) {
        alertMsg = angular.element('#date-alert-msg');
      }
      if (vm.customQueryString.substring(vm.customQueryString.toLowerCase().indexOf('from'), vm.customQueryString.toLowerCase().indexOf('where')).split(',').length > 30) {
        displayAlertMsg(dateOverRange);
      } else if (vm.customQueryString.toLowerCase().indexOf('group by') !== -1 && vm.customQueryString.toLowerCase().indexOf('count(') === -1) {
        displayAlertMsg(invalidGroupBy);
      } else {
        alertMsg.addClass('hide');
        updateData();        
      }
    }

    function updateData() {
      if (vm.lineChartConfig.getHighcharts) {
        vm.linechart = vm.lineChartConfig.getHighcharts();          
        vm.linechart.showLoading();
      }
      CustomQuery.getCustomQueryData(vm.dataContainer,
                                     vm.noCountTableContainer,
                                     vm.customQueryString,
                                     vm.dateRange.startDate,
                                     vm.dateRange.endDate,
                                     vm.linechart,
                                     vm.lastGroupByAggregation,
                                     vm.dataFetched,
                                     displayAlertMsg,
                                     selectDropdownChartType,
                                     switchAxisType);
    }

    function displayAlertMsg(msg) {
      vm.alertMsgContent = msg;
      alertMsg.removeClass('hide');
    }

    function downloadCSV() {
      var fields;
      var dataToParse;
      var isNotDate = true;
      var filename = 'custom-query_' + today.toISOString().slice(0,10) + '.csv';

      if (vm.noCountTableContainer.visible) {
        fields = vm.noCountTableContainer.headers;
        dataToParse = vm.noCountTableContainer.data;
      } else {
        if (vm.lineChartConfig.xAxis.type === 'datetime') {
          fields = ['date', 'count'];
          isNotDate = false;
        } else {
          fields = [vm.lastGroupByAggregation.value, 'count'];
        }
        dataToParse = vm.dataContainer.data;
      }

      CSVparserUtils.downloadCSV2(dataToParse, false, filename, fields, isNotDate);
    }
  }

  CustomQueryController.$inject = ['CustomQuery', 'LinechartUtils', 'CSVparserUtils', 'APP_CONFIG'];

  angular.module('dataDashboard.customQuery.controller.CustomQueryController', [])
    .controller('CustomQueryController', CustomQueryController);
})();