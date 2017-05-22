(function () {
  'use strict';

  angular
    .module('jibbar.dashboard.templates.trend')
    .config(templatesTrendConfig);

  templatesTrendConfig.$inject = ['$stateProvider'];

  function templatesTrendConfig($stateProvider) {
    $stateProvider
      .state('dashboard.templates.trend', {
        url: '/trend',
        template: '<jibbar-dashboard-templates-trend></jibbar-dashboard-templates-trend>'
      });
  }
})();
