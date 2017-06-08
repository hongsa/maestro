(function () {
  'use strict';
  function Main($http, $q, $filter, APP_CONFIG, lodash) {
    return {
      getRecommendCardId : getRecommendCardId,
      getAssignmentSummary : getAssignmentSummary,
      getChapterInfo : getChapterInfo,
      getMilestones : getMilestones,
      getDailyDuration : getDailyDuration,
      getSkillsDescription : getSkillsDescription
    };
    function getRecommendCardId(userId, subjectId,  dataContainer) {
      var deferred = $q.defer();
      var query = '/lc_db_prd/_table/today_card_history?fields=card_id&filter=(user_id=' + userId + ')%20and%20(subject_id=' + subjectId + ')&limit=500&include_count=true';
      $http({
        url: APP_CONFIG.BACKEND_ADDRESS + query,
        method: 'GET',
        headers: {
          'X-DreamFactory-Application-Name': APP_CONFIG.DSP_API_NAME,
          'X-DreamFactory-Api-Key': APP_CONFIG.DSP_API_KEY
        }
      }).then(function (result) {
        dataContainer.splice(0);
        result.data.resource.forEach(function (row) {
          dataContainer.push(row.card_id);
        });
        deferred.resolve({ status: result.status });
      }, deferred.reject);
      return deferred.promise;
    }

    function getAssignmentSummary(userId, subjectId, assignContainer, recommendCardIdList, activityBarContainer, activityPieContainer, resultRowData) {
      var deferred = $q.defer();
      var query = 'SELECT * as count FROM log-* WHERE (_type="download" or _type="result") and user_id=' + userId + ' limit 10000';
      var resultList = [];
      var downloadList = [];
      var timeTmp = {};
      timeTmp.first = 0;
      timeTmp.second = 0;
      timeTmp.third = 0;
      $http({
        url: APP_CONFIG.ELASTIC_SEARCH_SQL + '?sql=' + query,
        method: 'GET',
        headers: { 'Content-Type': undefined }
      }).then(function (result) {
        if (!result.data.timed_out) {
          assignContainer.splice(0);
          activityPieContainer.splice(0);
          resultRowData.splice(0);

          activityBarContainer[0].data = [];
          for (var i =0; i < 24; i++) {
            activityBarContainer[0].data.push(0);
          }
          result.data.hits.hits.forEach(function (row) {
            if (row._type === 'download' && lodash.includes(downloadList, row._source.card_id) === false) {
              downloadList.push(row._source.card_id);
            } else if (row._type === 'result' && lodash.includes(resultList, row._source.card_id) === false && row._source.subject_id === 5 && row._source.is_today_card === true) {
              resultList.push(row._source.card_id);
            }
            if (row._type === 'result' && row._source.subject_id === 5) {
              var _hour = new Date(row._source.client_time - (row._source.duration * 1000)).getHours();
              activityBarContainer[0].data[_hour] += 1;
              if (_hour >= 0 && _hour < 12) {
                timeTmp.first +=1;
              } else if (_hour >= 12 && _hour < 16) {
                timeTmp.second +=1;
              } else if (_hour >= 16 && _hour < 24) {
                timeTmp.third +=1;
              }
            }
            if (row._type === 'result') {
              resultRowData.push(row._source);
            }
          });
        }
        downloadList = compareList(recommendCardIdList, downloadList);
        assignContainer.push({
          name: '완료',
          y: resultList.length,
          color: APP_CONFIG.COLORS[0]
        });
        assignContainer.push({
          name: '미완료',
          y: recommendCardIdList.length - resultList.length,
          color: APP_CONFIG.COLORS[4]
        });

        activityPieContainer.push({
          name: '오전(0~12) 카드 수',
          y:timeTmp.first,
          color: APP_CONFIG.GRADE_COLORS[2]
        });
        activityPieContainer.push({
          name: '오후(12~18) 카드 수',
          y:timeTmp.second,
          color: APP_CONFIG.GRADE_COLORS[1]
        });
        activityPieContainer.push({
          name: '저녁(18~24) 카드 수',
          y:timeTmp.third,
          color: APP_CONFIG.GRADE_COLORS[0]
        });


        deferred.resolve({ status: result.status, completed:resultList.length });
      }, deferred.reject);
      return deferred.promise;
    }

    function getChapterInfo(curriculum_type, subjectId, gradeId, dataContainer) {
      var deferred = $q.defer();
      var query = '/lc_db_prd/_proc/get_chapter_ids_by_subject_grade';
      var data = {
        params: [
          {
            name: "_curriculum_type",
            value: curriculum_type
          },
          {
            name: "_subject_id",
            value: subjectId
          },
          {
            name: "_grade_id",
            value: gradeId
          }
        ]
      };
      $http({
        url: APP_CONFIG.BACKEND_ADDRESS + query,
        method: 'POST',
        headers: {
          'X-DreamFactory-Application-Name': APP_CONFIG.DSP_API_NAME,
          'X-DreamFactory-Api-Key': APP_CONFIG.DSP_API_KEY,
          'Content-Type': 'application/json; charset=UTF-8'
        },
        data: data
      }).then(function (result) {
        //console.log(result)
        for (var k in dataContainer) {
          if (dataContainer.hasOwnProperty(k)){
            delete dataContainer[k];
          }
        }
        result.data.forEach(function (row) {
          dataContainer[row.chapter_id] = row.name;
        });
        deferred.resolve({ status: result.status });
      }, deferred.reject);
      return deferred.promise;
    }

    function getMilestones(userId, dataContainer) {
      var deferred = $q.defer();
      var query = '/lc_db_prd/_table/milestones?filter=user_id=' + userId;
      $http({
        url: APP_CONFIG.BACKEND_ADDRESS + query,
        method: 'GET',
        headers: {
          'X-DreamFactory-Application-Name': APP_CONFIG.DSP_API_NAME,
          'X-DreamFactory-Api-Key': APP_CONFIG.DSP_API_KEY
        },
      }).then(function (result) {
        dataContainer.splice(0);
        result.data.resource.forEach(function (row) {
          dataContainer.push(row.full_mark);
          dataContainer.push(row.completed_card);
          dataContainer.push(row.consecutive_correct_answer);
        });
        deferred.resolve({ status: result.status });
      }, deferred.reject);
      return deferred.promise;
    }

    function getDailyDuration (userId, dataContainer) {
      var deferred = $q.defer();
      var query = 'SELECT count(*) FROM log-* WHERE _type="result" and user_id=' + userId + ' group by date_histogram(alias="timestamp", field="@timestamp","interval"="1d"), duration';
      $http({
        url: APP_CONFIG.ELASTIC_SEARCH_SQL + '?sql=' + query,
        method: 'GET',
        headers: { 'Content-Type': undefined }
      }).then(function (result) {
        if (!result.data.timed_out) {
          //console.log(result.data)
          dataContainer.data.splice(0);
          result.data.aggregations.timestamp.buckets.forEach(function (row) {
            var durationSum = 0;
            row.duration.buckets.forEach(function(d) {
              durationSum += (d.key * d.doc_count);
            });
            dataContainer.data.push([
              row.key,
              Math.floor(durationSum / 60)
            ]);
          });
        }
        deferred.resolve({ status: result.status });
      }, deferred.reject);
      return deferred.promise;
    }

    function getSkillsDescription(dataContainer) {
      var deferred = $q.defer();
      var filter = '';
      Object.keys(dataContainer).forEach(function(item, idx) {
        filter += '(name=' + item + ')';
        if (Object.keys(dataContainer).length -1 !== idx) {
          filter += ' or ';
        }
      });
      var query = '/lc_db_prd/_table/unit_descriptions?filter=' + filter;
      $http({
        url: APP_CONFIG.BACKEND_ADDRESS + query,
        method: 'GET',
        headers: {
          'X-DreamFactory-Application-Name': APP_CONFIG.DSP_API_NAME,
          'X-DreamFactory-Api-Key': APP_CONFIG.DSP_API_KEY
        },
      }).then(function (result) {
        result.data.resource.forEach(function (row) {
          dataContainer[row.name]['description'] = row.old_description;
        });
        deferred.resolve({ status: result.status });
      }, deferred.reject);
      return deferred.promise;
    }

    function compareList(firstList, secondList) {
      var tmp = [];
      secondList.forEach(function (item1) {
        firstList.forEach(function (item2) {
          if (item1 === item2) {
            tmp.push(item1);
          }
        });
      });
      return tmp;
    }

  }

  Main.$inject = ['$http', '$q', '$filter', 'APP_CONFIG', 'lodash'];

  angular.module('maestro.main.service.Main', [])
      .factory('Main', Main);
})();
