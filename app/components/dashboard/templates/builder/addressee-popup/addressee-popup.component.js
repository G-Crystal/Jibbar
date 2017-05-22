(function () {
  'use strict';

  var componentConfig = {
    templateUrl: 'components/dashboard/templates/builder/addressee-popup/addressee-popup.html',
    controller: AddresseePopupController,
    bindings: {}
  };

  angular
    .module('jibbar.dashboard.templates.builder.addressee-popup')
    .component('jibbarDashboardTemplatesBuilderAddresseePopup', componentConfig);

  AddresseePopupController.$inject = ['jibbarPopup', 'emailService'];

  function AddresseePopupController(jibbarPopup, emailService) {
    var vm = this;

    vm.onPopupLink = onPopupLink;
    vm.differentReplyToEmail = false;
    vm.saveEmailInfo = saveEmailInfo;
    vm.emailData = {
      from: "",
      fromName: "",
      subject: "",
      replyTo: ""
    };

    ///////

    function onPopupLink() {

      //jibbarPopup.open('builder-addressee');
    }

    function saveEmailInfo(form) {
      if (!form.$valid) {
        return false;
      }
      emailService.setCurrentEmailInfo(vm.emailData);
     
    }
  }
})();