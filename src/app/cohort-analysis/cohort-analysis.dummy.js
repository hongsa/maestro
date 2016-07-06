(function() {
  'use strict';

  var dummies = function() {
    var today = new Date(),
        lastMonth = new Date(today.getTime());

    lastMonth.setDate(lastMonth.getDate() - 30);

    var activeUsersFor1day = [{
      timestamp: lastMonth.getTime(),
      data: 7202
    }, {
      timestamp: lastMonth.getTime() + 86400000,
      data: 6583
    }, {
      timestamp: lastMonth.getTime() + (86400000*2),
      data: 7102
    }, {
      timestamp: lastMonth.getTime() + (86400000*3),
      data: 7749
    }, {
      timestamp: lastMonth.getTime() + (86400000*4),
      data: 5932
    }, {
      timestamp: lastMonth.getTime() + (86400000*5),
      data: 6129
    }, {
      timestamp: lastMonth.getTime() + (86400000*6),
      data: 7281
    }, {
      timestamp: lastMonth.getTime() + (86400000*7),
      data: 7491
    }, {
      timestamp: lastMonth.getTime() + (86400000*8),
      data: 6919
    }, {
      timestamp: lastMonth.getTime() + (86400000*9),
      data: 6704
    }, {
      timestamp: lastMonth.getTime() + (86400000*10),
      data: 7277
    }, {
      timestamp: lastMonth.getTime() + (86400000*11),
      data: 7003
    }, {
      timestamp: lastMonth.getTime() + (86400000*12),
      data: 5824
    }, {
      timestamp: lastMonth.getTime() + (86400000*13),
      data: 6492
    }, {
      timestamp: lastMonth.getTime() + (86400000*14),
      data: 6110
    }, {
      timestamp: lastMonth.getTime() + (86400000*15),
      data: 6129
    }, {
      timestamp: lastMonth.getTime() + (86400000*16),
      data: 6185
    }, {
      timestamp: lastMonth.getTime() + (86400000*17),
      data: 6803
    }, {
      timestamp: lastMonth.getTime() + (86400000*18),
      data: 5624
    }, {
      timestamp: lastMonth.getTime() + (86400000*19),
      data: 6487
    }, {
      timestamp: lastMonth.getTime() + (86400000*20),
      data: 6991
    }, {
      timestamp: lastMonth.getTime() + (86400000*21),
      data: 7313
    }, {
      timestamp: lastMonth.getTime() + (86400000*22),
      data: 7508
    }, {
      timestamp: lastMonth.getTime() + (86400000*23),
      data: 6638
    }, {
      timestamp: lastMonth.getTime() + (86400000*24),
      data: 6041
    }, {
      timestamp: lastMonth.getTime() + (86400000*25),
      data: 6772
    }, {
      timestamp: lastMonth.getTime() + (86400000*26),
      data: 6427
    }, {
      timestamp: lastMonth.getTime() + (86400000*27),
      data: 6775
    }, {
      timestamp: lastMonth.getTime() + (86400000*28),
      data: 6032
    }, {
      timestamp: lastMonth.getTime() + (86400000*29),
      data: 6373
    }, {
      timestamp: today.getTime(),
      data: 6051
    }];

    var activeUsersFor7days = [{
      timestamp: lastMonth.getTime(),
      data: 7202 * 7
    }, {
      timestamp: lastMonth.getTime() + 86400000,
      data: 6583 * 7
    }, {
      timestamp: lastMonth.getTime() + (86400000*2),
      data: 7102 * 7
    }, {
      timestamp: lastMonth.getTime() + (86400000*3),
      data: 7749 * 7
    }, {
      timestamp: lastMonth.getTime() + (86400000*4),
      data: 5932 * 7
    }, {
      timestamp: lastMonth.getTime() + (86400000*5),
      data: 6129 * 7
    }, {
      timestamp: lastMonth.getTime() + (86400000*6),
      data: 7281 * 7
    }, {
      timestamp: lastMonth.getTime() + (86400000*7),
      data: 7491 * 7
    }, {
      timestamp: lastMonth.getTime() + (86400000*8),
      data: 6919 * 7
    }, {
      timestamp: lastMonth.getTime() + (86400000*9),
      data: 6704 * 7
    }, {
      timestamp: lastMonth.getTime() + (86400000*10),
      data: 7277 * 7
    }, {
      timestamp: lastMonth.getTime() + (86400000*11),
      data: 7003 * 7
    }, {
      timestamp: lastMonth.getTime() + (86400000*12),
      data: 5824 * 7
    }, {
      timestamp: lastMonth.getTime() + (86400000*13),
      data: 6492 * 7
    }, {
      timestamp: lastMonth.getTime() + (86400000*14),
      data: 6110 * 7
    }, {
      timestamp: lastMonth.getTime() + (86400000*15),
      data: 6129 * 7
    }, {
      timestamp: lastMonth.getTime() + (86400000*16),
      data: 6185 * 7
    }, {
      timestamp: lastMonth.getTime() + (86400000*17),
      data: 6803 * 7
    }, {
      timestamp: lastMonth.getTime() + (86400000*18),
      data: 5624 * 7
    }, {
      timestamp: lastMonth.getTime() + (86400000*19),
      data: 6487 * 7
    }, {
      timestamp: lastMonth.getTime() + (86400000*20),
      data: 6991 * 7
    }, {
      timestamp: lastMonth.getTime() + (86400000*21),
      data: 7313 * 7
    }, {
      timestamp: lastMonth.getTime() + (86400000*22),
      data: 7508 * 7
    }, {
      timestamp: lastMonth.getTime() + (86400000*23),
      data: 6638 * 7
    }, {
      timestamp: lastMonth.getTime() + (86400000*24),
      data: 6041 * 7
    }, {
      timestamp: lastMonth.getTime() + (86400000*25),
      data: 6772 * 7
    }, {
      timestamp: lastMonth.getTime() + (86400000*26),
      data: 6427 * 7
    }, {
      timestamp: lastMonth.getTime() + (86400000*27),
      data: 6775 * 7
    }, {
      timestamp: lastMonth.getTime() + (86400000*28),
      data: 6032 * 7
    }, {
      timestamp: lastMonth.getTime() + (86400000*29),
      data: 6373 * 7
    }, {
      timestamp: today.getTime(),
      data: 6051 * 7
    }];

    var activeUsersFor14days = [{
      timestamp: lastMonth.getTime(),
      data: 7202 * 7 * 2
    }, {
      timestamp: lastMonth.getTime() + 86400000,
      data: 6583 * 7 * 2
    }, {
      timestamp: lastMonth.getTime() + (86400000*2),
      data: 7102 * 7 * 2
    }, {
      timestamp: lastMonth.getTime() + (86400000*3),
      data: 7749 * 7 * 2
    }, {
      timestamp: lastMonth.getTime() + (86400000*4),
      data: 5932 * 7 * 2
    }, {
      timestamp: lastMonth.getTime() + (86400000*5),
      data: 6129 * 7 * 2
    }, {
      timestamp: lastMonth.getTime() + (86400000*6),
      data: 7281 * 7 * 2
    }, {
      timestamp: lastMonth.getTime() + (86400000*7),
      data: 7491 * 7 * 2
    }, {
      timestamp: lastMonth.getTime() + (86400000*8),
      data: 6919 * 7 * 2
    }, {
      timestamp: lastMonth.getTime() + (86400000*9),
      data: 6704 * 7 * 2
    }, {
      timestamp: lastMonth.getTime() + (86400000*10),
      data: 7277 * 7 * 2
    }, {
      timestamp: lastMonth.getTime() + (86400000*11),
      data: 7003 * 7 * 2
    }, {
      timestamp: lastMonth.getTime() + (86400000*12),
      data: 5824 * 7 * 2
    }, {
      timestamp: lastMonth.getTime() + (86400000*13),
      data: 6492 * 7 * 2
    }, {
      timestamp: lastMonth.getTime() + (86400000*14),
      data: 6110 * 7 * 2
    }, {
      timestamp: lastMonth.getTime() + (86400000*15),
      data: 6129 * 7 * 2
    }, {
      timestamp: lastMonth.getTime() + (86400000*16),
      data: 6185 * 7 * 2
    }, {
      timestamp: lastMonth.getTime() + (86400000*17),
      data: 6803 * 7 * 2
    }, {
      timestamp: lastMonth.getTime() + (86400000*18),
      data: 5624 * 7 * 2
    }, {
      timestamp: lastMonth.getTime() + (86400000*19),
      data: 6487 * 7 * 2
    }, {
      timestamp: lastMonth.getTime() + (86400000*20),
      data: 6991 * 7 * 2
    }, {
      timestamp: lastMonth.getTime() + (86400000*21),
      data: 7313 * 7 * 2
    }, {
      timestamp: lastMonth.getTime() + (86400000*22),
      data: 7508 * 7 * 2
    }, {
      timestamp: lastMonth.getTime() + (86400000*23),
      data: 6638 * 7 * 2
    }, {
      timestamp: lastMonth.getTime() + (86400000*24),
      data: 6041 * 7 * 2
    }, {
      timestamp: lastMonth.getTime() + (86400000*25),
      data: 6772 * 7 * 2
    }, {
      timestamp: lastMonth.getTime() + (86400000*26),
      data: 6427 * 7 * 2
    }, {
      timestamp: lastMonth.getTime() + (86400000*27),
      data: 6775 * 7 * 2
    }, {
      timestamp: lastMonth.getTime() + (86400000*28),
      data: 6032 * 7 * 2
    }, {
      timestamp: lastMonth.getTime() + (86400000*29),
      data: 6373 * 7 * 2
    }, {
      timestamp: today.getTime(),
      data: 6051 * 7 * 2
    }];

    var activeUsersFor30days = [{
      timestamp: lastMonth.getTime(),
      data: 7202 * 7 * 4
    }, {
      timestamp: lastMonth.getTime() + 86400000,
      data: 6583 * 7 * 4
    }, {
      timestamp: lastMonth.getTime() + (86400000*2),
      data: 7102 * 7 * 4
    }, {
      timestamp: lastMonth.getTime() + (86400000*3),
      data: 7749 * 7 * 4
    }, {
      timestamp: lastMonth.getTime() + (86400000*4),
      data: 5932 * 7 * 4
    }, {
      timestamp: lastMonth.getTime() + (86400000*5),
      data: 6129 * 7 * 4
    }, {
      timestamp: lastMonth.getTime() + (86400000*6),
      data: 7281 * 7 * 4
    }, {
      timestamp: lastMonth.getTime() + (86400000*7),
      data: 7491 * 7 * 4
    }, {
      timestamp: lastMonth.getTime() + (86400000*8),
      data: 6919 * 7 * 4
    }, {
      timestamp: lastMonth.getTime() + (86400000*9),
      data: 6704 * 7 * 4
    }, {
      timestamp: lastMonth.getTime() + (86400000*10),
      data: 7277 * 7 * 4
    }, {
      timestamp: lastMonth.getTime() + (86400000*11),
      data: 7003 * 7 * 4
    }, {
      timestamp: lastMonth.getTime() + (86400000*12),
      data: 5824 * 7 * 4
    }, {
      timestamp: lastMonth.getTime() + (86400000*13),
      data: 6492 * 7 * 4
    }, {
      timestamp: lastMonth.getTime() + (86400000*14),
      data: 6110 * 7 * 4
    }, {
      timestamp: lastMonth.getTime() + (86400000*15),
      data: 6129 * 7 * 4
    }, {
      timestamp: lastMonth.getTime() + (86400000*16),
      data: 6185 * 7 * 4
    }, {
      timestamp: lastMonth.getTime() + (86400000*17),
      data: 6803 * 7 * 4
    }, {
      timestamp: lastMonth.getTime() + (86400000*18),
      data: 5624 * 7 * 4
    }, {
      timestamp: lastMonth.getTime() + (86400000*19),
      data: 6487 * 7 * 4
    }, {
      timestamp: lastMonth.getTime() + (86400000*20),
      data: 6991 * 7 * 4
    }, {
      timestamp: lastMonth.getTime() + (86400000*21),
      data: 7313 * 7 * 4
    }, {
      timestamp: lastMonth.getTime() + (86400000*22),
      data: 7508 * 7 * 4
    }, {
      timestamp: lastMonth.getTime() + (86400000*23),
      data: 6638 * 7 * 4
    }, {
      timestamp: lastMonth.getTime() + (86400000*24),
      data: 6041 * 7 * 4
    }, {
      timestamp: lastMonth.getTime() + (86400000*25),
      data: 6772 * 7 * 4
    }, {
      timestamp: lastMonth.getTime() + (86400000*26),
      data: 6427 * 7 * 4
    }, {
      timestamp: lastMonth.getTime() + (86400000*27),
      data: 6775 * 7 * 4
    }, {
      timestamp: lastMonth.getTime() + (86400000*28),
      data: 6032 * 7 * 4
    }, {
      timestamp: lastMonth.getTime() + (86400000*29),
      data: 6373 * 7 * 4
    }, {
      timestamp: today.getTime(),
      data: 6051 * 7 * 4
    }];

    this.activeUsersFor1day = activeUsersFor1day;
    this.activeUsersFor7days = activeUsersFor7days;
    this.activeUsersFor14days = activeUsersFor14days;
    this.activeUsersFor30days = activeUsersFor30days;
  };

  angular.module('dataDashboard.cohortAnalysis.constant.DUMMY4', [])
    .constant('DUMMY4', new dummies());
})();