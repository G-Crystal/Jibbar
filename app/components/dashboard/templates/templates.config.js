(function () {
  'use strict';

  angular
    .module('jibbar.dashboard.templates')
    .config(templatesConfig);

  templatesConfig.$inject = ['$stateProvider'];

  function templatesConfig($stateProvider) {
    $stateProvider
      .state('dashboard.templates', {
        url: '/templates',
        abstract: true,
        template: '<jibbar-dashboard-templates></jibbar-dashboard-templates>',
        data: {
          authRequired: true
        }
      });
  }
})();
