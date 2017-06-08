(function () {
  'use strict';
  function MainController($scope, $rootScope, Main, APP_CONFIG, PiechartUtils, LinechartUtils, BarchartUtils, SkillDetail, FindContent, $location) {
    var vm = this;
    vm.userId = 9833;
    vm.gradeId = 4;
    vm.selectedStudent = '조하늘';
    vm.selectedImg = 'a';

    vm.subjectId = 5;
    vm.curriculum_type = 'official';
    vm.selectedTab = 0;
    vm.selectedUnitName = '';

    vm.recommendCardIdList = [];
    vm.resultRowData = [];
    vm.chapterInfo = {};
    vm.skillsDetailData = {};
    vm.milestoneList = [];
    vm.findContentList = [];

    vm.assignmentPieChart = [];
    vm.skillsPieChart = [];
    vm.acivityPieChart = [];
    vm.skillDurationPieChart = [];

    vm.acivityBarChart = [{
      name: '시간 별 카드 수',
      data: [],
      color: APP_CONFIG.COLORS[0]
    }
    ];

    vm.durationChart = {
      name: '일별 공부시간(분)',
      data: [[new Date().getTime(), 0]],
      id: 'minute',
      color: APP_CONFIG.COLORS[0]
    };
    vm.durationBarChartData = [
      vm.durationChart
    ];

    vm.durationBarChartConfig = new BarchartUtils.BarChartConfig2(vm.durationBarChartData, null, true);
    vm.skillsPieChartConfig = new PiechartUtils.PieChartConfig(vm.skillsPieChart);
    vm.activityPieChartConfig = new PiechartUtils.PieChartConfig(vm.acivityPieChart);
    vm.activityBarChartConfig = new BarchartUtils.BarChartConfig(vm.acivityBarChart);
    vm.skillDurationPieChartConfig = new PiechartUtils.PieChartConfig(vm.skillDurationPieChart);

    vm.selectUser = selectUser;
    vm.goFindContent = goFindContent;
    vm.getCardColor = getCardColor;
    vm.selectTab = selectTab;
    vm.getAchievementColor = getAchievementColor;
    vm.goFindContent = goFindContent;
    init();

    function init() {
      summary();
      milestones();
      dailyDuration();
    }

    function selectUser(userId, gradeId, student, img) {
      vm.userId = userId;
      vm.gradeId = gradeId;
      vm.selectedStudent = student;
      vm.selectedTab = 0;
      vm.selectedImg = img;
      init();
    }
    function selectTab(tabId) {
      vm.selectedTab = tabId;
    }

    function summary() {
      Main.getRecommendCardId(vm.userId, vm.subjectId, vm.recommendCardIdList).then(function(response) {
        if (response.status === 200) {
          Main.getAssignmentSummary(vm.userId, vm.subjectId, vm.assignmentPieChart, vm.recommendCardIdList, vm.acivityBarChart, vm.acivityPieChart, vm.resultRowData).then(function(response) {
            if (response.status === 200) {
              vm.assignmentPieChartConfig = new PiechartUtils.PieChartConfig(vm.assignmentPieChart, '완료', response.completed);
              skillsDetail();
            }
          });
        }
      });
    }

    function skillsDetail() {
      Main.getChapterInfo(vm.curriculum_type, vm.subjectId, vm.gradeId, vm.chapterInfo).then(function(response) {
        if (response.status === 200) {
          //console.log(vm.chapterInfo)
          vm.skillsDetailData = {};
          vm.skillsPieChart.splice(0);
          vm.skillDurationPieChart.splice(0);
          getSkillsDetail();
          skillsSummary();
          skillsDurationPieChart();
          getSkillsDescription();
        }

      });
    }

    function milestones() {
      Main.getMilestones(vm.userId, vm.milestoneList).then(function (response) {
        if (response.status === 200) {

        }
      })
    }

    function dailyDuration () {
      Main.getDailyDuration(vm.userId, vm.durationChart).then(function (response) {
        if (response.status === 200) {
          //console.log('duration success')
        }
      })
    }

    function getSkillsDetail() {
      for (var k in vm.chapterInfo) {
        var tmp = {};
        tmp.achievement = [];
        tmp.duration = [];
        tmp.cardInfo = [];
        tmp.name = vm.chapterInfo[k];
        vm.resultRowData.forEach(function (row) {
          if (parseInt(k) === row.chapter_id) {
            if (Object.keys(vm.skillsDetailData).indexOf(vm.chapterInfo[k]) === -1) {
              tmp.duration.push(row.duration);
              tmp.achievement.push(calculateQuiz(row.total_quizzes, row.correct_quizzes));
              tmp.cardInfo.push(row);
              vm.skillsDetailData[vm.chapterInfo[k]] = tmp;
            } else {
              vm.skillsDetailData[vm.chapterInfo[k]].duration.push(row.duration);
              vm.skillsDetailData[vm.chapterInfo[k]].cardInfo.push(row);
              vm.skillsDetailData[vm.chapterInfo[k]].achievement.push(calculateQuiz(row.total_quizzes, row.correct_quizzes));
            }
          }
        });
      }

      for (var s in vm.skillsDetailData) {
        var total = 0;
        var duration = 0;
        var achievement = [0,0,0,0,0];
        vm.skillsDetailData[s].achievement.forEach(function (item) {
          total += item;
        });
        vm.skillsDetailData[s].duration.forEach(function (item) {
          duration += item;
        });
        vm.skillsDetailData[s].achievement.forEach(function (item) {
          if (item > 80 && item <= 100) {
            achievement[0] += 1;
          } else if (item > 60 && item <= 80) {
            achievement[1] += 1;
          } else if (item > 40 && item <= 60) {
            achievement[2] += 1;
          } else if (item > 20 && item <= 40) {
            achievement[3] += 1;
          } else if (item >= 0 && item <= 20) {
            achievement[4] += 1;
          }
        });
        achievement[5] = vm.skillsDetailData[s].achievement.length;
        vm.skillsDetailData[s].totalAchievement = total / vm.skillsDetailData[s].achievement.length;
        vm.skillsDetailData[s].totalDuration = Math.ceil((duration));
        vm.skillsDetailData[s].achievement = achievement;
      }
      //console.log(vm.skillsDetailData)
    }

    function getSkillsDescription() {
      Main.getSkillsDescription(vm.skillsDetailData).then(function (response) {
        if (response.status === 200) {
          //console.log(vm.skillsDetailData)
        }
      });
    }

    function goFindContent(unitName) {
      vm.selectedUnitName = unitName;
      FindContent.open(vm.curriculum_type, vm.subjectId, vm.selectedUnitName);
    }

    function skillsDurationPieChart() {
      for (var s in vm.skillsDetailData) {
        vm.skillDurationPieChart.push({
          name: vm.skillsDetailData[s].name,
          y : Math.floor(vm.skillsDetailData[s].totalDuration / 60)
        });
      }
    }

    function skillsSummary() {
      var tmp = {};
      tmp.veryGood = 0;
      tmp.good = 0;
      tmp.medium = 0;
      tmp.bad = 0;
      tmp.veryBad = 0;
      for (var s in vm.skillsDetailData) {
        if (vm.skillsDetailData[s].totalAchievement > 80 && vm.skillsDetailData[s].totalAchievement <= 100) {
          tmp.veryGood += 1;
        } else if (vm.skillsDetailData[s].totalAchievement > 60 && vm.skillsDetailData[s].totalAchievement <= 80) {
          tmp.good += 1;
        } else if (vm.skillsDetailData[s].totalAchievement > 40 && vm.skillsDetailData[s].totalAchievement <= 60) {
          tmp.medium += 1;
        } else if (vm.skillsDetailData[s].totalAchievement > 20 && vm.skillsDetailData[s].totalAchievement <= 40) {
          tmp.bad += 1;
        } else if (vm.skillsDetailData[s].totalAchievement >= 0 && vm.skillsDetailData[s].totalAchievement <= 20) {
          tmp.veryBad += 1;
        }
      }
      vm.skillsPieChart.push({
        name : '매우 좋음',
        y : tmp.veryGood,
        color: APP_CONFIG.GRADE_COLORS[0]
      });
      vm.skillsPieChart.push({
        name : '좋음',
        y : tmp.good,
        color: APP_CONFIG.GRADE_COLORS[1]
      });
      vm.skillsPieChart.push({
        name : '중간',
        y : tmp.medium,
        color: APP_CONFIG.GRADE_COLORS[2]
      });
      vm.skillsPieChart.push({
        name : '나쁨',
        y : tmp.bad,
        color: APP_CONFIG.GRADE_COLORS[3]
      });
      vm.skillsPieChart.push({
        name : '매우 나쁨',
        y : tmp.veryBad,
        color: APP_CONFIG.GRADE_COLORS[4]
      });
    }

    function calculateQuiz(total, correct) {
      var calculate = (correct / total) * 100;
      if (total === 0 && correct === 0) {
        calculate = 0;
      } else if (total === 0 && correct !== 0) {
        calculate = 100;
      }
      return calculate;
    }

    function getCardColor(count, total) {
      var width = Math.floor((count / total) * 90);
      if (count === 0) {
        return { 'width': width + '%', 'display' : 'none'};
      }
      return { 'width': width + '%'};
    }

    function getAchievementColor(input) {
      if (input > 80 && input <= 100) {
        return { 'color': APP_CONFIG.GRADE_COLORS[0], 'font-weight' : 'bold'};
      } else if (input > 60 && input <= 80) {
        return { 'color': APP_CONFIG.GRADE_COLORS[1], 'font-weight' : 'bold'};
      } else if (input > 40 && input <= 60) {
        return { 'color': APP_CONFIG.GRADE_COLORS[2], 'font-weight' : 'bold'};
      } else if (input > 20 && input <= 40) {
        return { 'color': APP_CONFIG.GRADE_COLORS[3], 'font-weight' : 'bold'};
      } else if (input >= 0 && input <= 20) {
        return { 'color': APP_CONFIG.GRADE_COLORS[4], 'font-weight' : 'bold'};
      }

    }

  }

  MainController.$inject = [
    '$scope',
    '$rootScope',
    'Main',
    'APP_CONFIG',
    'PiechartUtils',
    'LinechartUtils',
    'BarchartUtils',
    'SkillDetail',
    'FindContent',
    '$location'
  ];
  angular.module('maestro.main.controller.MainController', []).controller('MainController', MainController);
}());