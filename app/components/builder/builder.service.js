(function () {
  'use strict';

  angular
    .module('jibbar.builder')
    .service('jibbarBuilder', builderService);

  builderService.$inject = ['$q'];

  function builderService($q) {
    var iframeWindowElement = null;
    var iframeMainContainerElement = null;
    var iframeHoversContainerElement = null;
    var iframeResizePromise = null;
    var mainResizePromise = null;
    var customizableDirectives = [];

    var service = {
      setIframeWindowElement: setIframeWindowElement,
      setIframeMainContainerElement: setIframeMainContainerElement,
      getIframeMainContainerElement: getIframeMainContainerElement,
      setIframeHoversContainerElement: setIframeHoversContainerElement,
      getIframeHoversContainerElement: getIframeHoversContainerElement,
      getIframeResizePromise: getIframeResizePromise,
      getMainResizePromise: getMainResizePromise,
      addCustomizableDirective: addCustomizableDirective,
      updateCustomizableDirectivesPosition: updateCustomizableDirectivesPosition
    };

    return service;

    ///////

    function setIframeWindowElement(element) {
      iframeWindowElement = element;
      generateIframeResizePromise();
    }

    function setIframeMainContainerElement(element) {
      iframeMainContainerElement = element;
      generateMainResizePromise();
    }

    function getIframeMainContainerElement() {
      return iframeMainContainerElement;
    }

    function setIframeHoversContainerElement(element) {
      iframeHoversContainerElement = element;
    }

    function getIframeHoversContainerElement() {
      return iframeHoversContainerElement;
    }

    function getIframeResizePromise() {
      return iframeResizePromise;
    }

    function getMainResizePromise() {
      return mainResizePromise;
    }

    function generateIframeResizePromise() {
      if (!iframeWindowElement) return;
      var deferred = $q.defer();

      iframeWindowElement.resize(function () {
        deferred.notify();
      });

      iframeResizePromise = deferred.promise;
    }

    function generateMainResizePromise() {
      if (!iframeMainContainerElement) return;
      var deferred = $q.defer();

      new ResizeSensor(iframeMainContainerElement, function () {
        deferred.notify();
      });

      mainResizePromise = deferred.promise;
    }

    function addCustomizableDirective(directive) {
      customizableDirectives.push(directive);
    }
    
    function updateCustomizableDirectivesPosition() {
      customizableDirectives.forEach(function (directive) {
        directive.setHoverElementPosition();
      });
    }
  }
})();