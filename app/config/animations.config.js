(function () {
  'use strict';

  angular
    .module('jibbar')
    .animation('.animate-slide', animationFactory);

  function animationFactory() {
    return {
      enter: function (element, doneFn) {
        angular.element(element).hide().slideDown(250, doneFn)
      },
      move: function (element, doneFn) {
        angular.element(element).slideDown(250, doneFn)
      },
      leave: function (element, doneFn) {
        angular.element(element).slideUp(250, doneFn)
      }
    }
  }
})();
