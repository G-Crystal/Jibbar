(function () {
  'use strict';

  angular
    .module('jibbar.home.sign-up')
    .config(homeSignUpConfig);

  homeSignUpConfig.$inject = ['$stateProvider'];

  function homeSignUpConfig($stateProvider) {
    $stateProvider
      .state('home.sign-up', {
        url: '/sign-up',
        template: '<jibbar-home-sign-up></jibbar-home-sign-up>'
      });
  }
})();
