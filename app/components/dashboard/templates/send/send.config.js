(function () {
  'use strict';

  angular
    .module('jibbar.dashboard.templates.send')
    .config(templatesSendConfig);

  templatesSendConfig.$inject = ['$stateProvider'];

  function templatesSendConfig($stateProvider) {
    $stateProvider
      .state('dashboard.templates.send', {
        url: '/send',
        template: '<jibbar-dashboard-templates-send schedule="$ctrl.schedule"></jibbar-dashboard-templates-send>'
      });
  }
})();
