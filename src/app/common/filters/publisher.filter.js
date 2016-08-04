(function () {
  'use strict';

  var publisherId = {
    "resource": [
      {
        "id": 1,
        "name": "Classting"
      },
      {
        "id": 2,
        "name": "김태우"
      },
      {
        "id": 3,
        "name": "윤요한"
      },
      {
        "id": 4,
        "name": "비상교육"
      },
      {
        "id": 5,
        "name": "YBM잉글루"
      },
      {
        "id": 6,
        "name": "교학사"
      },
      {
        "id": 7,
        "name": "미래엔"
      },
      {
        "id": 8,
        "name": "EBS"
      },
      {
        "id": 9,
        "name": "금성출판사 푸르넷"
      },
      {
        "id": 10,
        "name": "천재교육해법스터디"
      },
      {
        "id": 11,
        "name": "이준헌"
      },
      {
        "id": 12,
        "name": "API테스트"
      },
      {
        "id": 13,
        "name": "대교"
      },
      {
        "id": 14,
        "name": "이충은"
      },
      {
        "id": 15,
        "name": "클요미♡"
      },
      {
        "id": 16,
        "name": "샤비놈"
      },
      {
        "id": 17,
        "name": "(주)지학사"
      },
      {
        "id": 18,
        "name": "EBS 초등"
      },
      {
        "id": 19,
        "name": "EBS 중학"
      },
      {
        "id": 20,
        "name": "금성출판사"
      },
      {
        "id": 21,
        "name": "디즈니코리아"
      },
      {
        "id": 22,
        "name": "lctestqa운영"
      },
      {
        "id": 23,
        "name": "lctestqa운영"
      },
      {
        "id": 24,
        "name": "미래엔 아이세움"
      },
      {
        "id": 25,
        "name": "YBM"
      },
      {
        "id": 26,
        "name": "정철영어TV"
      },
      {
        "id": 27,
        "name": "윤선생영어교실"
      },
      {
        "id": 28,
        "name": "와이즈캠프"
      },
      {
        "id": 29,
        "name": "대교"
      },
      {
        "id": 30,
        "name": "MBC"
      },
      {
        "id": 31,
        "name": "knowre"
      },
      {
        "id": 32,
        "name": "서울교대 컴퓨터교육과"
      },
      {
        "id": 33,
        "name": "캐치잇잉글리쉬"
      },
      {
        "id": 34,
        "name": "비상교육"
      },
      {
        "id": 35,
        "name": "차이나탄"
      },
      {
        "id": 36,
        "name": "능률교육"
      },
      {
        "id": 37,
        "name": "좋은책신사고"
      },
      {
        "id": 38,
        "name": "청담러닝"
      },
      {
        "id": 39,
        "name": "매일경제"
      },
      {
        "id": 40,
        "name": "모네상스"
      },
      {
        "id": 41,
        "name": "시공미디어(홈런)"
      },
      {
        "id": 42,
        "name": "Brightstorm"
      },
      {
        "id": 43,
        "name": "이상현"
      },
      {
        "id": 44,
        "name": "하이라이츠"
      },
      {
        "id": 45,
        "name": "위션"
      },
      {
        "id": 46,
        "name": "올림피아드 교육"
      },
      {
        "id": 47,
        "name": "동아출판"
      },
      {
        "id": 48,
        "name": "엔트리"
      },
      {
        "id": 49,
        "name": "HMH"
      },
      {
        "id": 50,
        "name": "백미란"
      },
      {
        "id": 51,
        "name": "문정아중국어"
      },
      {
        "id": 52,
        "name": "杨帆"
      },
      {
        "id": 53,
        "name": "초3"
      },
      {
        "id": 54,
        "name": "백미쌀"
      },
      {
        "id": 55,
        "name": "조현구"
      },
      {
        "id": 56,
        "name": "이충은"
      },
      {
        "id": 57,
        "name": "Jayon Kim"
      }
    ]
  }


  function publisherFilter() {
    return function(input) {
      var result;
      publisherId.resource.forEach(function (item) {
      if(item.id === input) {
        result = item.name
      }
      });
      return result
    }
  }

  angular.module('dataDashboard.common.filter.publisher', [])
      .filter('publisher', publisherFilter);
})();