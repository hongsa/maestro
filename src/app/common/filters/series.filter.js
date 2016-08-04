(function () {
  'use strict';

var seriesId = {
  "resource": [
    {
      "id": 1,
      "name": "시리즈명3"
    },
    {
      "id": 2,
      "name": "오투 초등과학 6-1"
    },
    {
      "id": 3,
      "name": "BLUE 6"
    },
    {
      "id": 4,
      "name": "BLUE 9"
    },
    {
      "id": 5,
      "name": "BLUE 4"
    },
    {
      "id": 6,
      "name": "BLUE 8"
    },
    {
      "id": 7,
      "name": "나노"
    },
    {
      "id": 8,
      "name": "선생님이 강력 추천하는 단원평가"
    },
    {
      "id": 9,
      "name": "선생님이 강력 추천하는 단원평가"
    },
    {
      "id": 10,
      "name": "선생님이 강력 추천하는 단원평가"
    },
    {
      "id": 13,
      "name": "올리드"
    },
    {
      "id": 15,
      "name": "푸르넷"
    },
    {
      "id": 16,
      "name": "푸르넷"
    },
    {
      "id": 17,
      "name": "핵심노트"
    },
    {
      "id": 19,
      "name": "나노 과학"
    },
    {
      "id": 20,
      "name": "YBM 잉글루 BLUE 8권"
    },
    {
      "id": 22,
      "name": "2단원테스트"
    },
    {
      "id": 23,
      "name": "선생님이 강력 추천하는 단원평가"
    },
    {
      "id": 24,
      "name": "선생님이 강력 추천하는 단원평가"
    },
    {
      "id": 25,
      "name": "올리드"
    },
    {
      "id": 26,
      "name": "올리드"
    },
    {
      "id": 27,
      "name": "오투"
    },
    {
      "id": 28,
      "name": "오투"
    },
    {
      "id": 29,
      "name": "ORANGE 2"
    },
    {
      "id": 30,
      "name": "ORANGE 3"
    },
    {
      "id": 31,
      "name": "ORANGE 5"
    },
    {
      "id": 32,
      "name": "ORANGE 6"
    },
    {
      "id": 33,
      "name": "YELLOW 2"
    },
    {
      "id": 34,
      "name": "YELLOW 4"
    },
    {
      "id": 35,
      "name": "YELLOW 6"
    },
    {
      "id": 36,
      "name": "YELLOW 12"
    },
    {
      "id": 37,
      "name": "GREEN 2"
    },
    {
      "id": 38,
      "name": "핵심노트"
    },
    {
      "id": 39,
      "name": "BLUE 3"
    },
    {
      "id": 40,
      "name": "green2"
    },
    {
      "id": 41,
      "name": "BLUE 1"
    },
    {
      "id": 42,
      "name": "BLUE 2"
    },
    {
      "id": 43,
      "name": "BLUE 5"
    },
    {
      "id": 44,
      "name": "BLUE 7"
    },
    {
      "id": 45,
      "name": "BLUE 10"
    },
    {
      "id": 46,
      "name": "BLUE 11"
    },
    {
      "id": 47,
      "name": "BLUE 12"
    },
    {
      "id": 48,
      "name": "ORANGE 1"
    },
    {
      "id": 49,
      "name": "ORANGE 3"
    },
    {
      "id": 50,
      "name": "ORANGE 4"
    },
    {
      "id": 51,
      "name": "ORANGE 7"
    },
    {
      "id": 52,
      "name": "ORANGE 8"
    },
    {
      "id": 53,
      "name": "ORANGE 9"
    },
    {
      "id": 54,
      "name": "ORANGE 10"
    },
    {
      "id": 55,
      "name": "ORANGE 11"
    },
    {
      "id": 56,
      "name": "ORANGE 12"
    },
    {
      "id": 57,
      "name": "GREEN 1"
    },
    {
      "id": 58,
      "name": "GREEN 2"
    },
    {
      "id": 59,
      "name": "GREEN 3"
    },
    {
      "id": 60,
      "name": "GREEN 4"
    },
    {
      "id": 61,
      "name": "GREEN 5"
    },
    {
      "id": 62,
      "name": "GREEN 6"
    },
    {
      "id": 63,
      "name": "GREEN 7"
    },
    {
      "id": 64,
      "name": "GREEN 8"
    },
    {
      "id": 65,
      "name": "GREEN 9"
    },
    {
      "id": 66,
      "name": "GREEN 10"
    },
    {
      "id": 67,
      "name": "GREEN 11"
    },
    {
      "id": 68,
      "name": "GREEN 12"
    },
    {
      "id": 69,
      "name": "YELLOW 1"
    },
    {
      "id": 70,
      "name": "YELLOW 3"
    },
    {
      "id": 71,
      "name": "YELLOW 5"
    },
    {
      "id": 72,
      "name": "YELLOW 7"
    },
    {
      "id": 73,
      "name": "YELLOW 8"
    },
    {
      "id": 74,
      "name": "YELLOW 9"
    },
    {
      "id": 75,
      "name": "YELLOW 10"
    },
    {
      "id": 76,
      "name": "YELLOW 11"
    },
    {
      "id": 77,
      "name": "하잇"
    },
    {
      "id": 78,
      "name": "오투"
    },
    {
      "id": 79,
      "name": "오투"
    },
    {
      "id": 80,
      "name": "선생님이 강력 추천하는 단원평가"
    },
    {
      "id": 81,
      "name": "선생님이 강력 추천하는 단원평가"
    },
    {
      "id": 82,
      "name": "선생님이 강력 추천하는 단원평가"
    },
    {
      "id": 83,
      "name": "나노"
    },
    {
      "id": 85,
      "name": "푸르넷"
    },
    {
      "id": 86,
      "name": "푸르넷"
    },
    {
      "id": 87,
      "name": "푸르넷"
    },
    {
      "id": 88,
      "name": "푸르넷"
    },
    {
      "id": 89,
      "name": "푸르넷"
    },
    {
      "id": 90,
      "name": "푸르넷"
    },
    {
      "id": 91,
      "name": "NAVY 1"
    },
    {
      "id": 92,
      "name": "NAVY  2"
    },
    {
      "id": 93,
      "name": "NAVY 3"
    },
    {
      "id": 94,
      "name": "NAVY 4"
    },
    {
      "id": 95,
      "name": "NAVY 5"
    },
    {
      "id": 96,
      "name": "NAVY 6"
    },
    {
      "id": 97,
      "name": "NAVY 7"
    },
    {
      "id": 98,
      "name": "NAVY 8"
    },
    {
      "id": 99,
      "name": "NAVY 9"
    },
    {
      "id": 100,
      "name": "NAVY 10"
    },
    {
      "id": 101,
      "name": "NAVY 11"
    },
    {
      "id": 102,
      "name": "NAVY 12"
    },
    {
      "id": 103,
      "name": "PURPLE 1"
    },
    {
      "id": 104,
      "name": "PURPLE 2"
    },
    {
      "id": 105,
      "name": "PURPLE 3"
    },
    {
      "id": 106,
      "name": "PURPLE 4"
    },
    {
      "id": 107,
      "name": "PURPLE 5"
    },
    {
      "id": 108,
      "name": "PURPLE 6"
    },
    {
      "id": 109,
      "name": "PURPLE 7"
    },
    {
      "id": 110,
      "name": "PURPLE 8"
    },
    {
      "id": 111,
      "name": "PURPLE 9"
    },
    {
      "id": 112,
      "name": "PURPLE 10"
    },
    {
      "id": 113,
      "name": "PURPLE 11"
    },
    {
      "id": 114,
      "name": "PURPLE 12"
    },
    {
      "id": 115,
      "name": "샘플"
    },
    {
      "id": 116,
      "name": "오투"
    },
    {
      "id": 117,
      "name": "오투"
    },
    {
      "id": 118,
      "name": "오투"
    },
    {
      "id": 121,
      "name": "나노과학"
    },
    {
      "id": 122,
      "name": "올리드"
    },
    {
      "id": 123,
      "name": "평가문제집"
    },
    {
      "id": 124,
      "name": "핵심노트"
    },
    {
      "id": 125,
      "name": "핵심노트"
    },
    {
      "id": 126,
      "name": "핵심노트"
    },
    {
      "id": 127,
      "name": "핵심노트"
    },
    {
      "id": 128,
      "name": "핵심노트"
    },
    {
      "id": 129,
      "name": "핵심노트"
    },
    {
      "id": 130,
      "name": "오투"
    },
    {
      "id": 131,
      "name": "올리드"
    },
    {
      "id": 132,
      "name": "나노"
    },
    {
      "id": 133,
      "name": "영어로 배우는 마법천자문"
    },
    {
      "id": 134,
      "name": "WANNA BE 또봇"
    },
    {
      "id": 135,
      "name": "WANNA BE 또봇 시즌1"
    },
    {
      "id": 136,
      "name": "WANNA BE 또봇 시즌2"
    },
    {
      "id": 137,
      "name": "WANNA BE 또봇 시즌3"
    },
    {
      "id": 138,
      "name": "만점왕"
    },
    {
      "id": 139,
      "name": "만점왕"
    },
    {
      "id": 140,
      "name": "만점왕"
    },
    {
      "id": 141,
      "name": "만점왕"
    },
    {
      "id": 142,
      "name": "만점왕"
    },
    {
      "id": 143,
      "name": "만점왕"
    },
    {
      "id": 144,
      "name": "만점왕"
    },
    {
      "id": 145,
      "name": "만점왕"
    },
    {
      "id": 146,
      "name": "기초영문법 1"
    },
    {
      "id": 147,
      "name": "기초영문법 2"
    },
    {
      "id": 148,
      "name": "TV중학"
    },
    {
      "id": 149,
      "name": "TV중학"
    },
    {
      "id": 150,
      "name": "test"
    },
    {
      "id": 151,
      "name": "TEST"
    },
    {
      "id": 152,
      "name": "만점왕"
    },
    {
      "id": 153,
      "name": "한달만에 초등영문법 뽀개기"
    },
    {
      "id": 154,
      "name": "한달만에 초등 영문법 뽀개기"
    },
    {
      "id": 155,
      "name": "TV중학"
    },
    {
      "id": 156,
      "name": "TV중학"
    },
    {
      "id": 157,
      "name": "TV중학"
    },
    {
      "id": 158,
      "name": "TV중학"
    },
    {
      "id": 159,
      "name": "만점왕"
    },
    {
      "id": 160,
      "name": "만점왕"
    },
    {
      "id": 161,
      "name": "만점왕"
    },
    {
      "id": 162,
      "name": "수학 자습서"
    },
    {
      "id": 163,
      "name": "자습서"
    },
    {
      "id": 164,
      "name": "자습서"
    },
    {
      "id": 165,
      "name": "자습서"
    },
    {
      "id": 166,
      "name": "풍산자 필수유형"
    },
    {
      "id": 167,
      "name": "풍산자 필수유형"
    },
    {
      "id": 168,
      "name": "풍산자 필수유형"
    },
    {
      "id": 169,
      "name": "풍산자 필수유형"
    },
    {
      "id": 170,
      "name": "풍산자 개념완성"
    },
    {
      "id": 171,
      "name": "풍산자 개념완성"
    },
    {
      "id": 172,
      "name": "풍산자 개념완성"
    },
    {
      "id": 173,
      "name": "자습서"
    },
    {
      "id": 174,
      "name": "수학중심&유형맞짱"
    },
    {
      "id": 175,
      "name": "수학중심&유형맞짱"
    },
    {
      "id": 176,
      "name": "수학중심&유형맞짱"
    },
    {
      "id": 177,
      "name": "수학중심&유형맞짱"
    },
    {
      "id": 178,
      "name": "개념플러스유형 라이트"
    },
    {
      "id": 179,
      "name": "개념플러스유형 라이트"
    },
    {
      "id": 180,
      "name": "개념플러스유형 라이트"
    },
    {
      "id": 181,
      "name": "개념플러스유형 라이트"
    },
    {
      "id": 182,
      "name": "개념플로스유형 파워"
    },
    {
      "id": 183,
      "name": "개념플러스유형 파워"
    },
    {
      "id": 184,
      "name": "개념플러스유형 파워"
    },
    {
      "id": 185,
      "name": "개념플러스유형 파워"
    },
    {
      "id": 186,
      "name": "개념플러스유형 파워"
    },
    {
      "id": 187,
      "name": "개념플러스유형 라이트 개념편"
    },
    {
      "id": 188,
      "name": "개념플러스유형 라이트 개념편"
    },
    {
      "id": 189,
      "name": "개념플러스유형 라이트 개념편"
    },
    {
      "id": 190,
      "name": "개념플러스유형 라이트 유형편"
    },
    {
      "id": 191,
      "name": "개념플러스유형 라이트 유형편"
    },
    {
      "id": 192,
      "name": "개념플러스유형 라이트 유형편"
    },
    {
      "id": 193,
      "name": "개념플러스유형 파워"
    },
    {
      "id": 194,
      "name": "개념플러스유형 파워"
    },
    {
      "id": 195,
      "name": "개념플러스유형 파워"
    },
    {
      "id": 196,
      "name": "나노"
    },
    {
      "id": 197,
      "name": "나노"
    },
    {
      "id": 198,
      "name": "나노"
    },
    {
      "id": 199,
      "name": "나노"
    },
    {
      "id": 200,
      "name": "English Serise"
    },
    {
      "id": 201,
      "name": "츤데레레"
    },
    {
      "id": 202,
      "name": "dd"
    },
    {
      "id": 203,
      "name": "ee"
    },
    {
      "id": 204,
      "name": "리듬중국어 Step1"
    },
    {
      "id": 205,
      "name": "교과서가 쉬워지는 용어 한국사 600"
    },
    {
      "id": 206,
      "name": "완소단어장"
    },
    {
      "id": 207,
      "name": "도란도란 한국사"
    },
    {
      "id": 208,
      "name": "기타과학"
    },
    {
      "id": 209,
      "name": "내신만점 평가 문제집"
    },
    {
      "id": 210,
      "name": "내신만점 평가 문제집"
    },
    {
      "id": 211,
      "name": "내신만점 평가 문제집"
    },
    {
      "id": 212,
      "name": "특강"
    },
    {
      "id": 213,
      "name": "특강"
    },
    {
      "id": 214,
      "name": "특강"
    },
    {
      "id": 215,
      "name": "자습서"
    },
    {
      "id": 216,
      "name": "자습서"
    },
    {
      "id": 217,
      "name": "특강"
    },
    {
      "id": 218,
      "name": "특강"
    },
    {
      "id": 219,
      "name": "3분 직업체험"
    },
    {
      "id": 220,
      "name": "ㅁㄴㅇㄹㅁㄴ"
    },
    {
      "id": 221,
      "name": "개념 플러스 유형"
    },
    {
      "id": 222,
      "name": "개념 플러스 유형"
    },
    {
      "id": 223,
      "name": "개념 플러스 유형"
    },
    {
      "id": 224,
      "name": "노리중등수학"
    },
    {
      "id": 225,
      "name": "노리중등수학"
    },
    {
      "id": 226,
      "name": "노리중등수학"
    },
    {
      "id": 227,
      "name": "통큰세계사"
    },
    {
      "id": 228,
      "name": "TV과학"
    },
    {
      "id": 229,
      "name": "TV중학"
    },
    {
      "id": 230,
      "name": "TV중학"
    },
    {
      "id": 231,
      "name": "TV중학"
    }
  ]
}



function seriesFilter() {
  return function(input) {
    var result;
    seriesId.resource.forEach(function (item) {
      if(item.id === input) {
        result = item.name
      }
    });
    return result
  }
}

angular.module('dataDashboard.common.filter.series', [])
    .filter('series', seriesFilter);
})();