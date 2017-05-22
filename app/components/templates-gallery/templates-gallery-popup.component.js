(function () {
  'use strict';

  var componentConfig = {
    templateUrl: 'components/templates-gallery/templates-gallery-popup.html',
    controller: TemplatesGalleryPopupController,
    bindings: {}
  };

  angular
    .module('jibbar.templates-gallery')
    .component('jibbarTemplatesGalleryPopup', componentConfig);

  TemplatesGalleryPopupController.$inject = [];

  function TemplatesGalleryPopupController() {
    var vm = this;

    vm.updateGallerySize = updateGallerySize;

    ///////

    function updateGallerySize() {
      $(window).resize();
    }
  }
})();
