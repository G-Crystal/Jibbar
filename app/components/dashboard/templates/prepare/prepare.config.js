(function () {
  'use strict';

  angular
    .module('jibbar.dashboard.templates.prepare')
    .config(templatesPrepareConfig);

  templatesPrepareConfig.$inject = ['$stateProvider'];

  function templatesPrepareConfig($stateProvider) {
    $stateProvider
      .state('dashboard.templates.prepare', {
        url: '/prepare',
       params:{isScheduled:false, schedule:0},
        template: '<jibbar-dashboard-templates-prepare></jibbar-dashboard-templates-prepare>'
      });
  }
})();
