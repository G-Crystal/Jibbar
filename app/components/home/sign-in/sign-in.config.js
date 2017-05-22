(function () {
  'use strict';

  angular
    .module('jibbar.home.sign-in')
    .config(homeSignInConfig);

  homeSignInConfig.$inject = ['$stateProvider'];

  function homeSignInConfig($stateProvider) {
    $stateProvider
      .state('home.sign-in', {
        url: '/sign-in',
        template: '<jibbar-home-sign-in></jibbar-home-sign-in>'
      });
  }
})();
