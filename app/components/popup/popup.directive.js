/**
 * In transcluded content you can use:
 * - $jp.data to access injected data.
 * - $jp.close(data) to close popup with injecting data to close popup callback.
 */

(function () {
  'use strict';

  angular
    .module('jibbar.popup')
    .directive('jibbarPopup', popupDirective);

  function popupDirective() {
    var directive = {
      restrict: 'EA',
      transclude: true,
      templateUrl: 'components/popup/popup.html',
      scope: {
        popupId: '<',
        popupOnLink: '&',
        popupOnOpen: '&'
      },
      controller: PopupController,
      controllerAs: '$ctrl',
      bindToController: true
    };

    return directive;
  }

  PopupController.$inject = ['$element', '$transclude', '$scope', 'jibbarPopup'];

  function PopupController($element, $transclude, $scope, jibbarPopup) {
    var vm = this;

    vm.$onInit = $onInit;
    vm.$postLink = $postLink;
    vm.setTransclusionData = setTransclusionData;

    ///////

    var transclusionScope = null;

    function $onInit() {
      transclude();
    }

    function $postLink() {
      
      // add popup to service
      jibbarPopup.addPopup(vm.popupId, {
        setTransclusionData: setTransclusionData,
        element: $element,
        onOpen: vm.popupOnOpen,
        onValid: function () {
          // on success move popup to popup container directive
          jibbarPopup.getContainer().append($element);
          vm.popupOnLink();
        }
      });
    }

    function transclude() {
      transclusionScope = $scope.$parent.$new();

      transclusionScope.$jp = {
        data: null,
        close: function (data) {
          jibbarPopup.close(vm.popupId, data);
        }
      };

      $transclude(transclusionScope, function (clone) {
        $element.find('.c-popup__content').html(clone);
      });
    }

    function setTransclusionData(data) {
      transclusionScope.$jp.data = data;
    }
  }
})();