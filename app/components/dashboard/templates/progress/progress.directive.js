(function () {
  'use strict';

  angular
    .module('jibbar.dashboard.templates.progress')
    .directive('jibbarDashboardTemplatesProgress', progressDirective);

  function progressDirective() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'components/dashboard/templates/progress/progress.html',
      controller: ProgressController,
      scope: {
        step: '<'
      },
      controllerAs: '$ctrl',
      bindToController: true
    };

    return directive;
  }

  ProgressController.$inject = ['jibbarPopup','$interval', 'emailService', 'toastr', '$state', 'userImageService', '$scope'];

  function ProgressController(jibbarPopup, $interval, emailService, toastr, $state, userImageService, $scope) {
    var vm = this;

    vm.view_recipient_button = false;
    vm.send_test_button = false;
    vm.saveDraft = saveDraft;
    vm.isViewingAdded = false;
    vm.switchViewAddedEvent = switchViewAddedEvent;
    vm.gotoAction = gotoAction;
	  vm.$onInit = $onInit;
	  vm.draftEmailId = null;
    vm.openDiscardPopup = openDiscardPopup;
	
    var promiseInterval;

    vm.isActive = function (stepName) {
      if(vm.step == 'preview' || vm.step == 'compose') {
        vm.send_test_button = true;
      }
      else if(vm.step == 'recipients'){
        vm.view_recipient_button = true;
      } 
      else if(vm.step == 'send' || 'schedule'){
        vm.checkout_buttons = true;
      }
      else {
        // do nothing
      }
      return vm.step == stepName;
    }
	
	 function $onInit() {
	 /*
		$scope.$on('image-update', function (event, arg) {
          vm.draftEmailId = arg.draftEmailId;
      });
	  */
	 }

    // vm.startInterval = function () {
    //   // stops any running interval to avoid two intervals running at the same time
    //   vm.stopInterval();
    //   if ($state.current.name == 'dashboard.templates.builder') {
    //     // store the interval promise
    //     promiseInterval = $interval(vm.saveDraft, 60000);
    //   }
    // };

    // // stops the interval
    // vm.stopInterval = function () {
    //   $interval.cancel(promiseInterval);
    // };

    // // starting the interval by default
    // vm.startInterval();



    function saveDraft() {
    //   console.log("Within Save Draft!");
    //   var emailSubject = emailService.getCurrentEmailSubject();
    //   if (emailSubject != null) {
    //     var emailPublicId = emailService.getCurrentEmailPublicId();
    //     //emailService.createEmailDraft();
    //     if (emailPublicId == null) {
    //       emailService.createOrUpdateEmailDraft(emailSubject).then(
    //         function (result) {
    //           if (result.success) {
    //             //toastr.success("Email Draft Saved Successfully!");
				// if(vm.draftEmailId) {
				// 	userImageService.copyImageFromDraft(vm.draftEmailId, result.emailId);
				// }
    //           }
    //         },
    //         function (error) {
    //           toastr.error(error.error.message);
    //         }
    //       )
    //     } else {
    //       emailService.updateEmailDraft(emailPublicId, emailSubject).then(
    //         function (result) {
    //           if (result.success) {
    //             //toastr.success("Email Draft Updated Successfully!");
    //           }
    //         },
    //         function (error) {
    //           toastr.error(error.error.message);
    //         }
    //       )
    //     }
    //   }

      
      emailService.saveEmail();


    }


    function openDiscardPopup(isScheduled) {
     // vm.sentBroadcastCostInfo();
       jibbarPopup.open('dashboard-templates-prepare-discard-popup', {
         isScheduled: false //vm.isScheduled
       });
    }



    function switchViewAddedEvent(){
      vm.isViewingAdded = !vm.isViewingAdded;
      jibbar.event.trigger(jibbar.event.events.SWITCH_VIEW_RECIPIENT_EVENT);

    }

    function gotoAction(action){
      

      if(action == 'send') {
       if(emailService.getNumberOfReceipents() == 0)
         {
           toastr.warning("Please select recipients.")
            $state.go('dashboard.templates.recipients')
           return false;
         }
         else
           $state.go('dashboard.templates.prepare', { isScheduled: false});    
         }
       else if(action == 'schedule') 
         $state.go('dashboard.templates.schedule', { isScheduled: true});

      //  else if(action == 'send')
      //    $state.go('dashboard.templates.prepare', { isScheduled: false});  
      //  else
      //    return false;
             
      // }
      
      }
      
    
    // $interval(function () {
    //   if ($state.current.name == 'dashboard.templates.builder') {
    //     console.log("Within Save Draft - Interval Called!");
    //     vm.saveDraft();
    //   }
    // }, 60000);



    //setInterval(vm.saveDraft(),60000);
  }
})();