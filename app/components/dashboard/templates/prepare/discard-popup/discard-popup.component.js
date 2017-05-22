(function(){
  'use strict';

  var componentConfig = {
    templateUrl: 'components/dashboard/templates/prepare/discard-popup/discard-popup.html',
    controller: DiscardPopupController,
    bindings: {}
  };

  angular
    .module('jibbar.dashboard.templates.prepare.discard-popup')
    .component('jibbarDashboardTemplatesPrepareDiscardPopup',componentConfig);

  DiscardPopupController.$inject = ['jibbarPopup', '$state', 'emailService'];

  function DiscardPopupController(jibbarPopup, $state, emailService){
    var vm = this;
    vm.discardEmail = discardEmail;
    vm.saveAsDraft = saveAsDraft;
    vm.$onInit = $onInit;
    vm.destination = null;
    function $onInit(){
      vm.destination = 'dashboard.templates.list';
      jibbar.event.on(jibbar.event.events.RESET_DESTINATION_EVENT, function (data) {
            
            vm.destination = data.destination;
            
       });
      
    }
    
    function discardEmail(){
      emailService.discardEmail();
      $state.go(vm.destination,{proceed: true});
      jibbarPopup.close('dashboard-templates-prepare-discard-popup');
    }

    function saveAsDraft(){
      emailService.saveEmail();
      $state.go(vm.destination,{proceed: true});
      jibbarPopup.close('dashboard-templates-prepare-discard-popup');
    }
  }
})();
