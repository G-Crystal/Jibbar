(function () {
  'use strict';

  angular
    .module('jibbar.dashboard.templates.schedule')
    .config(templatesScheduleConfig);

  templatesScheduleConfig.$inject = ['$stateProvider'];

  function templatesScheduleConfig($stateProvider) {
    $stateProvider
      .state('dashboard.templates.schedule', {
        url: '/schedule',
        params: {
          publicId: null
        },
        template: '<jibbar-dashboard-templates-schedule  schedule="$ctrl.schedule"></jibbar-dashboard-templates-schedule>'
      });
  }
})();