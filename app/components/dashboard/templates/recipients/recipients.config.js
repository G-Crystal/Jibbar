(function () {
  'use strict';

  angular
    .module('jibbar.dashboard.templates.recipients')
    .config(templatesRecipientsConfig);

  templatesRecipientsConfig.$inject = ['$stateProvider'];

  function templatesRecipientsConfig($stateProvider) {
    $stateProvider
      .state('dashboard.templates.recipients', {
        url: '/recipients',
        template: '<jibbar-dashboard-templates-recipients sketch="$ctrl.sketch"></jibbar-dashboard-templates-recipients>'
      });
  }
})();
