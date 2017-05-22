(function () {
  'use strict';

  angular
    .module('jibbar.dashboard.templates.builder')
    .config(templatesBuilderConfig);

  templatesBuilderConfig.$inject = ['$stateProvider'];

  function templatesBuilderConfig($stateProvider) {
    $stateProvider
      .state('dashboard.templates.builder', {
        url: '/builder/:templateId',
        template: '<jibbar-dashboard-templates-builder sketch="$ctrl.sketch"></jibbar-dashboard-templates-builder>'
      });
  }
})();
