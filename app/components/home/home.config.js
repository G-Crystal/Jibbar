(function () {
  'use strict';

  angular
    .module('jibbar.home')
    .config(homeConfig)
    .animation('.c-home__forms-item', formItemAnimationFactory);

  homeConfig.$inject = ['$stateProvider'];

  function homeConfig($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        template: '<jibbar-home></jibbar-home>',
        params: {
           proceed: false,
        },
      });
  }

  function formItemAnimationFactory() {
    return {
      enter: function (element, doneFn) {
        angular.element(element).hide().slideDown(500, doneFn)
      },
      move: function (element, doneFn) {
        angular.element(element).slideDown(500, doneFn)
      },
      leave: function (element, doneFn) {
        angular.element(element).slideUp(500, doneFn)
      }
    }
  }
})();
