(function () {
  'use strict';
  angular.module('maestro.common.constant.APP_CONFIG', []).constant('APP_CONFIG', {
    'LOCAL': 'http://localhost:8080/api/v2',
    'HOSTED': 'http://dsp.classting.net/rest',
    'BACKEND_ADDRESS': 'http://52.193.242.222/api/v2',
    'DSP_API_NAME': 'lc-dashboard',
    'DSP_API_KEY': '0124db4baff2a6855e0404a48d6cc1546f523ea71395d04030122035b0f80262',
    'S3_DATA_BUCKET': 'https://s3-ap-northeast-1.amazonaws.com/classting-dashboard',
    'ELASTIC_SEARCH_SQL': 'http://52.198.111.160:9200/_sql',
    //'ELASTIC_SEARCH_SQL': '/_sql',
    'GRADE_COLORS': [
      '#800080',
      '#008000',
      '#ff6347',
      '#0e3eda',
      '#ff0000'
    ],
    'COLORS': [
      '#519D9E',
      '#58C9B9',
      '#9DC8C8',
      '#FDD692',
      '#EC7357'
    ]
  });
}());