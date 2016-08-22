(function () {
  'use strict';
  angular.module('dataDashboard.common.constant.APP_CONFIG', []).constant('APP_CONFIG', {
    'LOCAL': 'http://localhost:8080/api/v2',
    'HOSTED': 'http://dsp.classting.net/rest',
    'BACKEND_ADDRESS': 'http://52.193.242.222/api/v2',
    'DSP_API_NAME': 'lc-dashboard',
    'DSP_API_KEY': '0124db4baff2a6855e0404a48d6cc1546f523ea71395d04030122035b0f80262',
    'S3_DATA_BUCKET': 'https://s3-ap-northeast-1.amazonaws.com/classting-dashboard',
    //'ELASTIC_SEARCH_SQL': 'http://52.69.16.112:9200/_sql',
    'ELASTIC_SEARCH_SQL': '/_sql',
    'COLORS': [
      '#F44336',
      '#2196F3',
      '#FFC107',
      '#9C27B0',
      '#009688',
      '#FF5722',
      '#00BCD4',
      '#CDDC39',
      '#673AB7',
      '#4CAF50',
      '#E91E63',
      '#3F51B5',
      '#FF9800',
      '#795548',
      '#8BC34A',
      '#000000'
    ]
  });
}());