(function () {
  'use strict';

  angular
    .module('jibbar.dashboard.templates.list')
    .config(templatesListConfig);

  templatesListConfig.$inject = ['$stateProvider'];

  function templatesListConfig($stateProvider) {
    $stateProvider
      .state('dashboard.templates.list', {
        url: '?test',
        template: '<jibbar-dashboard-templates-list></jibbar-dashboard-templates-list>',
        params: {
           proceed: false,
        },
      });
  }
})();
