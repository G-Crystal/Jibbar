(function () {
  'use strict';

  angular
    .module('jibbar.popup')
    .directive('jibbarPopupContainer', popupContainerDirective);

  function popupContainerDirective() {
    var directive = {
      restrict: 'EA',
      template: '<div class="c-popup__background" jibbar-popup-close></div>',
      controller: PopupContainerController
    };

    return directive;
  }

  PopupContainerController.$inject = ['$element', 'jibbarPopup'];

  function PopupContainerController($element, jibbarPopup) {
    var vm = this;

    vm.$onDestroy = function () {
      jibbarPopup.clear();
    };

    jibbarPopup.setContainer($element);
    jibbarPopup.setBackground($element.find('.c-popup__background'));
  }
})();