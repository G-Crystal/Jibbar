(function () {
  'use strict';

  angular
    .module('jibbar.templatePreview')
    .config(templatePreviewConfig);

  templatePreviewConfig.$inject = ['$stateProvider'];

  function templatePreviewConfig($stateProvider) {
    $stateProvider
      .state('templatePreview', {
        url: '/template-preview/:templateId',
        template: '<jibbar-template-preview></jibbar-template-preview>'
      });
  }
})();
