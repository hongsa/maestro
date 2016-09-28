(function () {
  'use strict';
  var today = new Date();
  var constraintDay = new Date(today.getTime());
  var twoDaysPast = new Date(constraintDay.getTime());
  twoDaysPast.setDate(twoDaysPast.getDate() - 2);
  function UserPageFlowController(UserPageFlow) {
    var vm = this;
    var defaultData;
    var alertMsg;
    var dateOverConstraint = 'You can\'t select date after ' + constraintDay.getFullYear() + '. ' + (constraintDay.getMonth() + 1) + '. ' + constraintDay.getDate();
    var dateOverRange = 'Please select date within 2 month range';
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
    vm.userInfo = {};
    vm.triggerUpdateWithDate = triggerUpdateWithDate;
    vm.getUserInfo = getUserInfo;
    function triggerUpdateWithDate() {
      if (!alertMsg) {
        alertMsg = angular.element('#date-alert-msg');
      }
      if (vm.dateRange.endDate - vm.dateRange.startDate > 2678400000 * 2) {
        displayAlertMsg(dateOverRange);
      } else {
        alertMsg.addClass('hide');
        updateData();
      }
    }
    function updateData() {
      UserPageFlow.getUserPageFlow(vm.userPageFlowData, vm.userId, UserPageFlow.dateRange.startDate, UserPageFlow.dateRange.endDate, displayAlertMsg).then(function (result) {
        getUserInfo();
      });
    }
    function getUserInfo() {
      UserPageFlow.getUserInfo(vm.userInfo, vm.userId).then(function (result) {
        UserPageFlow.getPaidDate(vm.userInfo, vm.userId).then(function (result) {
          UserPageFlow.getDownloadedCount(vm.userInfo, vm.userId).then(function (result) {
            UserPageFlow.getCompleteCount(vm.userInfo, vm.userId).then(function (result) {
              UserPageFlow.getLastSignAt(vm.userInfo, vm.userId);
            });
          });
        });
      });
    }
    function displayAlertMsg(msg) {
      vm.alertMsgContent = msg;
      alertMsg.removeClass('hide');
    }
  }
  UserPageFlowController.$inject = ['UserPageFlow'];
  angular.module('dataDashboard.userPageFlow.controller.UserPageFlowController', []).controller('UserPageFlowController', UserPageFlowController);
}());