(function () {
  'use strict';

  var componentConfig = {
    templateUrl: 'components/builder/link-popup/link-popup.html',
    controller: LinkPopupController,
    bindings: {}
  };

  angular
    .module('jibbar.builder.link-popup')
    .component('jibbarBuilderLinkPopup', componentConfig);

  LinkPopupController.$inject = ['jibbarPopup', '$scope', '$rootScope'];

  function LinkPopupController(jibbarPopup, $scope, $rootScope) {
    var vm = this;

    vm.text = null;
    vm.link = null;
    vm.element = null;
    vm.save = save;
	vm.onLinkPopupOpen = onLinkPopupOpen;

    $scope.$on('anchor-edit', function (event, arg) {
        vm.link = arg.link;
        vm.text = arg.text;
    });

    function onLinkPopupOpen() {
		var transmittedData = jibbarPopup.getPopupBindings('builder-link');
		if(transmittedData) {
			vm.text = transmittedData.text;
			vm.link = transmittedData.link;
		}
	}

    function save(text, link) {
      //$rootScope.$broadcast('anchor-update', { 'link': vm.link, 'text': vm.text, 'element': vm.element });
      jibbarPopup.close('builder-link', {
        'link': link, 'text': text
      });
    }
  }
})();
