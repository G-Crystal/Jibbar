(function () {
  'use strict';

  angular
    .module('jibbar.home', [
      'jibbar.home.sign-in',
      'jibbar.home.sign-up',
      'jibbar.home.sign-up-success',
      'jibbar.home.forgot-password',
      'jibbar.home.email-activation',
      'jibbar.home.reset-password',
      'jibbar.home.pre-registration'
    ]);
})();