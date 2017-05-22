(function () {
  'use strict';

  angular
    .module('jibbar.popup')
    .directive('jibbarPopupClose', popupCloseDirective);

  function popupCloseDirective() {
    var directive = {
      restrict: 'EA',
      controller: PopupCloseController
    };

    return directive;
  }

  PopupCloseController.$inject = ['$element', 'jibbarPopup'];

  function PopupCloseController($element, jibbarPopup) {
    $element.click(function () {
      jibbarPopup.close();
    });
  }
})();