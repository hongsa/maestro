(function () {
  'use strict';
  var pageName = {
    'landing': '랜딩 화면',
    'signin': '러닝카드 시작하기',
    'Reset PW': '',
    'Reset PW New PW': '',
    'join': '가입',
    'join.terms': '이용약관',
    'join.select_role': '가입시 역할 선택',
    'join.enter_school_grade': '가입시 학년 선택',
    'join.select_subjects': '가입시 과목 선택',
    'join.parent_confirm': '가입시 부모 등록',
    'join.start_trial': '체험 시작 안내',
    'today': '투데이 추천',
    'today.change_card': '추천 카드 변경',
    'card.cover': '카드 표지',
    'card.sheet': '카드 시트',
    'card.quiz': '퀴즈',
    'card.explanation': '퀴즈 해설',
    'card.rate': '카드 평가',
    'card.milestone': '마일스톤',
    'card.result': '카드 결과',
    'card.menu': '카드 메뉴',
    'card.info': '카드 정보',
    'card.references': '카드 출처',
    'card.editor_info': '카드 저작자 정보',
    'series': '시리즈',
    'editor': '에디터 상세 페이지',
    'explore': '탐색',
    'explore.popular': '인기 카드 목록',
    'explore.subject_series': '과목별 시리즈 목록',
    'search': '검색',
    'performance': '성취도',
    'performance.milestone': '목표달성',
    'performance.past': '이전 성취도',
    'profile': '프로필',
    'profile.edit': '프로필 수정',
    'search_school': '학교 검색',
    'select_grade': '학년 선택',
    'select_subject': '과목 선택',
    'profile.subject_detail': '',
    'bookmarks': '즐겨찾기 카드',
    'completed': '완료한 카드',
    'settings': '설정',
    'settings.change_email': '이메일 변경 modal',
    'settings.change_pw': '이름 변경',
    'settings.change_name': '비밀번호 변경',
    'settings.noti_frequency': '추천카드 알람',
    'settings.noti_time': '알람 시간',
    'downloaded_cards': '다운로드된 카드',
    'settings.notices': '공지사항',
    'settings.support': '고객지원',
    'settings.delete_account': '탈퇴',
    'subscription_info': '구독정보',
    'parent_dashboard': '학부모 대시보드',
    'child_settings': '자녀 설정',
    'child_performance': '자녀 성취도',
    'parent_settings': '부모 설정',
    'parent_settings.invite_child': '',
    'parent_settings.account': '부모 계정 설정',
    'plan': '플랜 선택',
    'payment.info': '결제 정보',
    'payment.edit': '결제 정보 수정',
    'payment.list': '',
    'subscription.unsubscribe': '구독 해지',
    'payment.refund': '환불 신청',
    'subscription.index': '결제 완료',
    'subscription.select': '구독할 자녀 선택',
    'payment.detail': '',
    '_null' : '없음'
  };

  function pageName2Filter() {
    return function (input) {
      for (var p in pageName) {
        if (pageName[p] === input) {
          return p;
        }
      }
    };
  }

  angular.module('dataDashboard.common.filter.pageName2', []).filter('pageName2', pageName2Filter);
}());


