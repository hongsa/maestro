(function () {
  'use strict';
  var subjectId =
  {
    'resource': [
      {
        'id': 2,
        'name': '수학'
      },
      {
        'id': 3,
        'name': '사회'
      },
      {
        'id': 5,
        'name': '과학'
      },
      {
        'id': 41,
        'name': '영어 - 초급'
      },
      {
        'id': 42,
        'name': '영어 - 중급'
      },
      {
        'id': 43,
        'name': '사회1'
      },
      {
        'id': 44,
        'name': '사회2'
      },
      {
        'id': 45,
        'name': '역사'
      },
      {
        'id': 46,
        'name': '중국어 - 초급'
      },
      {
        'id': 47,
        'name': '교양 - 역사'
      },
      {
        'id': 48,
        'name': '교양 - 일반'
      },
      {
        'id': 49,
        'name': '한자'
      }
    ]
  }

  function subjectFilter() {
    return function (input) {
      var result;
      if (input === null) {
        return 'Extra';
      }
      subjectId.resource.forEach(function (item) {
        if (item.id === input) {
          result = item.name;
        }
      });
      return result;
    };
  }

  angular.module('maestro.common.filter.subject', []).filter('subject', subjectFilter);
}());