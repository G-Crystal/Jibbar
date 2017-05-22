(function () {
  'use strict';

  angular
    .module('jibbar.popup')
    .directive('jibbarPopupOpen', popupOpenDirective);

  function popupOpenDirective() {
    var directive = {
      restrict: 'EA',
      scope: {
        jibbarPopupOpen: '<'
      },
      controller: PopupOpenController,
      controllerAs: '$ctrl',
      bindToController: true
    };

    return directive;
  }

  PopupOpenController.$inject = ['$element', 'jibbarPopup'];

  function PopupOpenController($element, jibbarPopup) {
    
    var vm = this;

    $element.click(function () {
      
      jibbarPopup.open(vm.jibbarPopupOpen);
    });
  }
})();