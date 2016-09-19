(function () {
  'use strict';
  var gradeId = {
    'resource': [
      {
        'id': 1,
        'name': '초1'
      },
      {
        'id': 2,
        'name': '초2'
      },
      {
        'id': 3,
        'name': '초3'
      },
      {
        'id': 4,
        'name': '초4'
      },
      {
        'id': 5,
        'name': '초5'
      },
      {
        'id': 6,
        'name': '초6'
      },
      {
        'id': 7,
        'name': '중1'
      },
      {
        'id': 8,
        'name': '중2'
      },
      {
        'id': 9,
        'name': '중3'
      },
      {
        'id': 10,
        'name': '고1'
      },
      {
        'id': 11,
        'name': '고2'
      },
      {
        'id': 12,
        'name': '고3'
      }
    ]
  };

  function gradeFilter() {
    return function (input) {
      var result;
      if (input === null) {
        return 'Extra';
      }
      gradeId.resource.forEach(function (item) {
        if (item.id === input) {
          result = item.name;
        }
      });
      return result;
    };
  }

  angular.module('dataDashboard.common.filter.grade', []).filter('grade', gradeFilter);
}());