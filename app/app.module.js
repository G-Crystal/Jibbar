(function () {
  'use strict';

  angular
    .module('jibbar', [
      'ngAnimate',
      'ngSanitize',
      'ui.router',
      'vcRecaptcha',
      'perfect_scrollbar',
      'ui.bootstrap',
      'LocalStorageModule',
      'toastr',
      'ngBootbox',
      'blockUI',
      'jibbar.components',
      'angular-cloudinary',
      'ngAvatar',
      'ngCropper',
      'chart.js',
      'ngCsv',
      'ngCookies',
      'ngFileSaver'
    ]);

  // bootstrap app
  angular.element(document).ready(function () {
    angular.bootstrap(document.body, ['jibbar'], {
      strictDi: true
    });
  });
})();