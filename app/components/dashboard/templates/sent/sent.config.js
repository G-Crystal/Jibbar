(function () {
  'use strict';

  angular
    .module('jibbar.dashboard.templates.sent')
    .config(templatesSentConfig);

  templatesSentConfig.$inject = ['$stateProvider'];

  function templatesSentConfig($stateProvider) {
    $stateProvider
      .state('dashboard.templates.sent', {
        url: '/sent/:templateId',
        template: '<jibbar-dashboard-templates-sent></jibbar-dashboard-templates-sent>'
      });
  }
})();
