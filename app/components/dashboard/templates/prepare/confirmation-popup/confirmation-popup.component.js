(function () {
  'use strict';

  var componentConfig = {
    templateUrl: 'components/dashboard/templates/prepare/confirmation-popup/confirmation-popup.html',
    controller: ConfirmationPopupController,
    bindings: {}
  };

  angular
    .module('jibbar.dashboard.templates.prepare.confirmation-popup')
    .component('jibbarDashboardTemplatesPrepareConfirmationPopup', componentConfig);

  ConfirmationPopupController.$inject = ['jibbarPopup','emailService', '$stateParams', 'jibbarBuilder','toastr', '$state', 'timezoneService'];

  function ConfirmationPopupController(jibbarPopup, emailService, $stateParams, jibbarBuilder, toastr, $state, timezoneService) {

        var vm = this;
        vm.isScheduled    =  false;
        vm.$onInit        = $onInit;
        vm.prepareEmail   = prepareEmail;
        vm.scheduleNow    = scheduleNow;
        vm.sendNow        = sendNow;
        vm.sendOrScheduleEmail                = sendOrScheduleEmail;
        vm.checkEmailSubjectAndNoOfRecipients = checkEmailSubjectAndNoOfRecipients;
        vm.closeConfirmationPopup             = closeConfirmationPopup;
        vm.email          = {};
        vm.message        = {heading: "", about: ""};

 function $onInit() { 
        vm.isScheduled = $stateParams.isScheduled; 
        console.log("Popup:"+ vm.isScheduled);
        jibbar.event.on(jibbar.event.events.RESET_CONFIRMATION_POPUP_EVENT, function (data) {
            
            vm.message.heading = data.head;
            vm.message.about = data.about;
       });
    }
    function prepareEmail(){
      vm.recipientsList = emailService.getSelectedRecipients();
      vm.email = emailService.getCurrentEmailInfo(); 
      vm.email.body = escape(jibbarBuilder.getIframeMainContainerElement()[0].innerHTML); //emailService.getCurrentEmailBody(); 
      vm.email.isTest = false;
      vm.email.recipients = vm.recipientsList[0];
      vm.email.broadcastinfo = emailService.getCurrentBroadcastCostInfo();
 } 

 function scheduleNow(){ 
      vm.prepareEmail();
      vm.email.isScheduled = true;
      vm.email.scheduled_on = timezoneService.convertToUtc(angular.copy(vm.schedule)); //moment.utc(angular.copy(vm.schedule)).format('YYYY-MM-DD HH:mm:ss Z');
      vm.sendOrScheduleEmail("scheduled");
 }   

function sendNow() {
       vm.prepareEmail();
       vm.email.isScheduled = false;
       vm.sendOrScheduleEmail("send")
    } 


function sendOrScheduleEmail(action){
  if(vm.checkEmailSubjectAndNoOfRecipients())
     emailService.sendMail(vm.email).then(
        function (result) {
          if (result.success) {
            toastr.success("Email " + action +" successfully");
            vm.email = {};
            $state.go('dashboard.templates.list');
            vm.closeConfirmationPopup();
          } else {
            toastr.error(result.error);
          }

        },
        function (error) {

          toastr.error("Something went wrong!!!");
        });
    }
    
    function checkEmailSubjectAndNoOfRecipients(){
       if (vm.recipientsList.length === 0) {
        toastr.warning("Please select recipients before send mail.")
        return false;
      }

      if (emailService.getCurrentEmailSubject() == null || emailService.getCurrentEmailSubject() == "") {
        toastr.warning("Email subject can't be blank");
        return false;
      }

     return true; 
    }
 
   function closeConfirmationPopup( ) { 
       jibbarPopup.close('dashboard-templates-prepare-confirmation-popup')
    }
  }
})();
  