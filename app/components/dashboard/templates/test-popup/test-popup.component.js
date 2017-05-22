(function () {
  'use strict';

  var componentConfig = {
    templateUrl: 'components/dashboard/templates/test-popup/test-popup.html',
    controller: TestPopupController,
    bindings: {}
  };

  angular
    .module('jibbar.dashboard.templates.test-popup')
    .component('jibbarDashboardTemplatesTestPopup', componentConfig);

  TestPopupController.$inject = ['jibbarPopup', 'toastr', 'emailService', 'templateService',
    'jibbarBuilder'
  ];

  function TestPopupController(jibbarPopup, toastr, emailService, templateService,
    jibbarBuilder) {
    var vm = this;

    vm.send = send;
    vm.emailAddress = null;
    vm.email = {
      from: "",
      fromName: "",
      subject: "",
      body: "",
      recipients: []
    };

    ///////
    function SendNow() {

      vm.email = emailService.getCurrentEmailInfo();

      if (vm.email.body === null) {
        vm.email.body = escape(jibbarBuilder.getIframeMainContainerElement()[0].innerHTML); //emailService.getCurrentEmailBody();
      }

      vm.email.isTest = false;
      vm.email.isScheduled = false;
      vm.email.recipients = vm.recipientsList[0];

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

    function send(form) {
      if (!form.$valid) {
        return false;
      }

      if (emailService.getCurrentEmailSubject() == null || emailService.getCurrentEmailSubject() == "") {
        toastr.warning("Email subject can't be blank");
        return false;
      }

      vm.email = emailService.getCurrentEmailInfo();
      //if (vm.email.body === null) {
      vm.email.body = escape(jibbarBuilder.getIframeMainContainerElement()[0].innerHTML); //emailService.getCurrentEmailBody();
      //}
      vm.email.isTest = true;
      vm.email.isScheduled = false;


      vm.email.recipients = [{
        firstName: "Jibbar",
        lastName: "Mailer",
        emailAddress: vm.emailAddress
      }];

      emailService.sendMail(vm.email).then(
        function (result) {
          if (result.success) {
            toastr.success("Email send successfully");
            vm.emailAddress = null;
            jibbarPopup.close('templates-test');
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