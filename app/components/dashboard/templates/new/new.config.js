(function () {
  'use strict';

  angular
    .module('jibbar.dashboard.templates.new')
    .config(templatesNewConfig);

  templatesNewConfig.$inject = ['$stateProvider'];

  function templatesNewConfig($stateProvider) {
    $stateProvider
      .state('dashboard.templates.new', {
        url: '/new',
        template: '<jibbar-dashboard-templates-new></jibbar-dashboard-templates-new>'
      });
  }
})();
