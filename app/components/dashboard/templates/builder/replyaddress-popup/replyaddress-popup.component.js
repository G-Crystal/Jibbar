(function () {
  'use strict';

  var componentConfig = {
    templateUrl: 'components/dashboard/templates/builder/replyaddress-popup/replyaddress-popup.html',
    controller: ReplyAddressPopupController,
    bindings: {}
  };

  angular
    .module('jibbar.dashboard.templates.builder.replyaddress-popup')
    .component('jibbarDashboardTemplatesBuilderReplyaddressPopup', componentConfig);

  ReplyAddressPopupController.$inject = ['jibbarPopup', 'emailService'];

  function ReplyAddressPopupController(jibbarPopup, emailService) {
    var vm = this;

    vm.$onInit = $onInit;
    vm.saveReplyAddress = saveReplyAddress;
    vm.saveDefaultReplyAddress =saveDefaultReplyAddress;
    vm.replyToEmail = '';

    ///////

    function $onInit() { 
      vm.replyToEmail = emailService.getCurrentEmailReplyAddress();
    }

    function saveReplyAddress() {
      emailService.setCurrentEmailReplyAddress(vm.replyToEmail);
      jibbarPopup.close('builder-replyaddress');    
    }

    function saveDefaultReplyAddress(){
      vm.replyToEmail = emailService.getCurrentEmailFromAddress();
      emailService.setCurrentEmailReplyAddress(vm.replyToEmail);
      jibbarPopup.close('builder-replyaddress');
    }

  }
})();