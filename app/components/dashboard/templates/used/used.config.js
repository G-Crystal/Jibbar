(function () {
  'use strict';

  angular
    .module('jibbar.dashboard.templates.used')
    .config(templatesUsedConfig);

  templatesUsedConfig.$inject = ['$stateProvider'];

  function templatesUsedConfig($stateProvider) {
    $stateProvider
      .state('dashboard.templates.used', {
        url: '/used',
        template: '<jibbar-dashboard-templates-used></jibbar-dashboard-templates-used>'
      });
  }
})();
