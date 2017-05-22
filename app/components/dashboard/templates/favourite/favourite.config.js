(function () {
  'use strict';

  angular
    .module('jibbar.dashboard.templates.favourite')
    .config(templatesFavouriteConfig);

  templatesFavouriteConfig.$inject = ['$stateProvider'];

  function templatesFavouriteConfig($stateProvider) {
    $stateProvider
      .state('dashboard.templates.favourite', {
        url: '/favourite',
        template: '<jibbar-dashboard-templates-favourite></jibbar-dashboard-templates-favourite>'
      });
  }
})();
