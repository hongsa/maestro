(function() {
  'use strict';

  var today = new Date(),
      constraintDay = new Date(today.getTime());

  constraintDay.setDate(constraintDay.getDate()-1);

  var twoDaysPast = new Date(constraintDay.getTime());
  twoDaysPast.setDate(twoDaysPast.getDate() - 2);

  function UserPageFlowController(UserPageFlow) {
    var vm = this,
        defaultData,
        alertMsg,
        dateOverConstraint = "You can't select date after " + constraintDay.getFullYear() + '. ' + (constraintDay.getMonth()+1) + '. ' + constraintDay.getDate(),
        dateOverRange = 'Please select date within a month range';

    defaultData = {
      time: '-',
      cur_page: '-',
      prev_page: '-',
      user_ip: '-'
    };

    vm.dateRange = {
      startDate: twoDaysPast,
      endDate: constraintDay
    };
    vm.alertMsgContent;
    vm.constraintDay = constraintDay;
    UserPageFlow.dateRange = vm.dateRange;
    vm.userId = '';
    vm.userPageFlowData = [defaultData];

    vm.triggerUpdateWithDate = triggerUpdateWithDate;

    function triggerUpdateWithDate() {
      if (!alertMsg) {
        alertMsg = angular.element('#date-alert-msg');
      }
      if ((vm.dateRange.endDate - vm.dateRange.startDate) > 2678400000) {
        displayAlertMsg(dateOverRange);
      } else {
        alertMsg.addClass('hide');
        updateData();        
      }
    }

    function updateData() {
      UserPageFlow.getUserPageFlow(vm.userPageFlowData,
                                   vm.userId,
                                   UserPageFlow.dateRange.startDate,
                                   UserPageFlow.dateRange.endDate,
                                   displayAlertMsg);
    }

    function displayAlertMsg(msg) {
      vm.alertMsgContent = msg;
      alertMsg.removeClass('hide');
    }

  }

  UserPageFlowController.$inject = ['UserPageFlow'];

  angular.module('dataDashboard.userPageFlow.controller.UserPageFlowController', [])
    .controller('UserPageFlowController', UserPageFlowController);
})();