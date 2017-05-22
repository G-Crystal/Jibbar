(function () {
  'use strict';

  angular
    .module('jibbar.dashboard.templates.preview')
    .config(templatesPreviewConfig);

  templatesPreviewConfig.$inject = ['$stateProvider'];

  function templatesPreviewConfig($stateProvider) {
    $stateProvider
      .state('dashboard.templates.preview', {
        url: '/preview/:templateId',
        template: '<jibbar-dashboard-templates-preview sketch="$ctrl.sketch"></jibbar-dashboard-templates-preview>'
      });
  }
})();
