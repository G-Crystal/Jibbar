(function () {
  'use strict';

  angular
    .module('jibbar.dashboard.templates.back')
    .directive('jibbarDashboardTemplatesBack', backDirective);

  function backDirective() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'components/dashboard/templates/back/back.html',
      controller: BackController,
      scope: {
        step: '@',
        headingTitle: '@',
        headingAbout: '@'
      },
      controllerAs: '$ctrl',
      bindToController: true
    };

    return directive;
  }

  BackController.$inject = ['backService','jibbarPopup'];

  function BackController(backService,jibbarPopup) {
    var vm = this;

    vm.goBack = goBack;
    vm.openDiscardPopup = openDiscardPopup;
    vm.undoLastEdit = undoLastEdit;
    vm.generatePdf = generatePdf;
    vm.$onInit = $onInit;
	  vm.isBuilder = vm.step == 'builder' ? true : false;
    vm.isInvoice = vm.step == 'invoice' ? true : false;
    vm.isCharge = vm.step == 'charge' ? true : false;
    // vm.isActive = function (stepName) {
    //   if(vm.step == 'builder') {
    //     vm.isBuilder = true;
    //   }
      
    //   else {
    //     // do nothing
    //   }
    //   return vm.step == stepName;
    // }
	
	 function $onInit() {
	 	
	 }
	 function goBack(){
	 	
      backService.goBack();
      
     }

    function openDiscardPopup(){
    
      jibbarPopup.open('dashboard-templates-prepare-discard-popup');
      
    }

    function undoLastEdit(){
      jibbar.event.trigger(jibbar.event.events.UNDO_LAST_EDIT_EVENT);
    }

   function generatePdf(id,filename){
         backService.generatePdf(id,filename);
    }


 }
})();