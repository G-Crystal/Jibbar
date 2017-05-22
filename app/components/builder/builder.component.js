(function () {
  'use strict';

  var componentConfig = {
    templateUrl: 'components/builder/builder.html',
    controller: BuilderController,
    bindings: {
      builderTemplate: '<',
      builderOnChange: '&'
    }
  };

  angular
    .module('jibbar.builder')
    .component('jibbarBuilder', componentConfig);

  BuilderController.$inject = ['$scope', '$compile', 'jibbarBuilder', 'jibbarPopup', '$templateRequest','emailService'];

  function BuilderController($scope, $compile, jibbarBuilder, jibbarPopup, $templateRequest,emailService) {
    var vm = this;

    vm.$onInit = $onInit;
    vm.$onDestroy = $onDestroy;

    ///////

    var iframeElement = angular.element('.c-builder__iframe');
    var iframeWindow = angular.element(iframeElement[0].contentWindow || iframeElement[0]);
    var iframeDocument;
    var iframeBodyElement;
    var iframeMainContainerElement;
    var iframeHoversContainerElement;

    function $onInit() {
      emailService.IsEditingInProgress(true);
      emailService.setCurrentEmailFromAddress();
      emailService.setCurrentEmailReplyAddress();
      iframeElement.on('load', function () {
        $scope.$apply(function () {
          iframeDocument = iframeElement[0].contentDocument || iframeElement[0].contentWindow.document;
          iframeBodyElement = angular.element('body', iframeDocument);
          iframeMainContainerElement = angular.element('<main>').appendTo(iframeBodyElement);
          iframeHoversContainerElement = angular.element('<hovers>').appendTo(iframeBodyElement);

          setDefaultTemplateStyles();
          initTemplate();
          setServiceElements();
          watchForTemplateChange();
          updateIframeHeightOnMainResize();
         // jibbarPopup.open('builder-addressee');
        });
      });
    }

    function $onDestroy() {
      jibbarPopup.remove('builder-images');
      jibbarPopup.remove('builder-link');
    }

    function setServiceElements() {
      jibbarBuilder.setIframeWindowElement(iframeWindow);
      jibbarBuilder.setIframeMainContainerElement(iframeMainContainerElement);
      jibbarBuilder.setIframeHoversContainerElement(iframeHoversContainerElement);
    }

    function setDefaultTemplateStyles() {
      iframeBodyElement.css({
        'margin': 0,
        'background-color': '#fff'
      });

      $templateRequest('components/builder/hovers.html').then(function (hoversStyle) {
        iframeHoversContainerElement.append(hoversStyle);
      });
    }

    function initTemplate() {
      $compile(iframeMainContainerElement.html(vm.builderTemplate).contents())($scope);
      vm.builderOnChange({newValue: iframeMainContainerElement.html(), oldValue: vm.builderTemplate});
      adjustIframeHeightToItsContentHeight();
    }

    function watchForTemplateChange() {
      $scope.$watch(
        function () {
          return iframeMainContainerElement.html();
        },
        function (newValue, oldValue) {
          if (newValue != oldValue) {
            vm.builderOnChange({newValue: newValue, oldValue: oldValue});
            adjustIframeHeightToItsContentHeight();
          }
        }
      );
    }

    function adjustIframeHeightToItsContentHeight() {
      iframeElement.height(iframeDocument.body.scrollHeight);
    }

    function updateIframeHeightOnMainResize() {
      var resizePromise = jibbarBuilder.getMainResizePromise();
      if (resizePromise) {
        resizePromise.then(null, null, function () {
          adjustIframeHeightToItsContentHeight();
        });
      }
    }
  }
})();
