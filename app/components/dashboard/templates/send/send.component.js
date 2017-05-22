(function () {
  'use strict';

  var componentConfig = {
    templateUrl: 'components/dashboard/templates/send/send.html',
    controller: TemplatesSendController,
    bindings: {
      sketch: '<',
      schedule: '='
    }
  };

  angular
    .module('jibbar.dashboard.templates.send')
    .component('jibbarDashboardTemplatesSend', componentConfig);

  TemplatesSendController.$inject = ['jibbarBuilder', 'emailService', 'toastr', '$state', 'blockUI'];

  function TemplatesSendController(jibbarBuilder, emailService, toastr, $state, blockUI) {
    var vm = this;
    vm.SendNow = SendNow;
    vm.email = {
      subject: "",
      body: "",
      publicId: "",
      recipients: [],
      broadcastinfo: null
    };
    vm.sendMail = sendMail;


    vm.recipients = 0;
    vm.creditsNeeded = 0;
    vm.creditsAvailable = 0;
    vm.balance = 0;
    vm.recipientsList = [];

    function sendMail() { 
      vm.recipientsList = emailService.getSelectedRecipients();

      if (vm.recipientsList.length === 0) {
        toastr.warning("Please select recipients before send mail.")
        return false;
      } else if (vm.recipientsList[0].length > 2000) {
        toastr.warning("You can't broadcast am email to more than 2000 recipients at a time.")
        return false;
      }
      if (emailService.getCurrentEmailSubject() == null || emailService.getCurrentEmailSubject() == "") {
        toastr.warning("Email subject can't be blank");
        return false;
      }
      vm.SendNow();
    }


    function SendNow() {
      vm.email = emailService.getCurrentEmailInfo();
      vm.email.body = escape(jibbarBuilder.getIframeMainContainerElement()[0].innerHTML); //emailService.getCurrentEmailBody();//}
      vm.email.isTest = false;
      vm.email.isScheduled = false;
      vm.email.recipients = vm.recipientsList[0];
      vm.email.broadcastinfo = emailService.getCurrentBroadcastCostInfo();
      emailService.sendMail(vm.email).then(
        function (result) {
          if (result.success) {
            toastr.success("Email send successfully");
            vm.email = {};
            $state.go('dashboard.templates.list');
          } else {
            toastr.error(result.error);
          }

        },
        function (error) {

          toastr.error("Something went wrong!!!");
        });
    }
  }
})();