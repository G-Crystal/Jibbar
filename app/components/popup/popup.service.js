(function () {
  'use strict';

  angular
    .module('jibbar.popup')
    .service('jibbarPopup', popupService);

  popupService.$inject = [];

  function popupService() {
    var container = null;
    var background = null;
    var popups = [];
    var animationDuration = 400;

    var service = {
      open: open,
      close: close,
      remove: remove,
      addPopup: addPopup,
      clear: clear,
      setContainer: setContainer,
      getContainer: getContainer,
      setBackground: setBackground,
      getBackground: getBackground,
      getPopupBindings: getPopupBindings,
      popupBindings: null
    };

    return service;

    ///////

    /**
     * options: {
     *  noAnimation: boolean - disable fade animation
     * }
     *
     * @param id - id of popup that should be opened.
     * @param data - data that will be injected to popup and accessible under $jp.data.
     * @param closeCallback - function that will be triggered after closing popup.
     * @param options
     */

    function open(id, data, closeCallback, options) {

      var defaultOptions = {
        noAnimations: false
      };

      options = angular.extend({}, options, defaultOptions);

      if (angular.isUndefined(popups[id])) {
        throw 'Popup: ' + id + ' doesn\'t exist';
      }
      else{
        popups[id].popupBindings = data;
      }

      // save callback function
      if (closeCallback) {
        popups[id].closeCallback = closeCallback;
      }

      popups[id].setTransclusionData(data);
      getBackground().fadeIn(options.noAnimation ? 0 : animationDuration);
      popups[id].element.fadeIn(options.noAnimation ? 0 : animationDuration);
      popups[id].onOpen();
    }

    /**
     * Closes popup with specified id or all popups.
     *
     * @param id - id of popup or null for closing all popups.
     * @param data - data that will be used to trigger close callback.
     */
    function close(id, data) {
      getBackground().fadeOut(animationDuration);

      if (angular.isUndefined(id)) {
        // if id is not defined then close all popups
        Object.keys(popups).forEach(function (id) {
          popups[id].element.fadeOut(animationDuration);
          if (popups[id].closeCallback) {
            popups[id].closeCallback(data);
          }
        });
      }
      else if (!angular.isUndefined(popups[id])) {
        popups[id].element.fadeOut(animationDuration);
        if (popups[id].closeCallback) {
          popups[id].closeCallback(data);
        }
      }
    }

    function remove(id) {
      if (angular.isUndefined(popups[id])) return;
      popups[id].element.remove();
      delete popups[id];
      background.hide();
    }

    function addPopup(id, directive) {
      
      // add only once
      if (!popups[id]) {
        popups[id] = directive;
        directive.onValid();
      }
    }

    function clear() {
      popups = [];
    }

    function setContainer(element) {
      
      container = element;
    }

    function getContainer() {
      
      return container;
    }

    function setBackground(element) {
      
      background = element;
    }

    function getBackground() {
      
      return background;
    }
    function getPopupBindings(id){
       return popups[id].popupBindings;
    }
  }
})();