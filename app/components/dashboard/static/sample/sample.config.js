(function () {
  'use strict';

  angular
    .module('jibbar.dashboard.static.sample')
    .config(staticSampleConfig);

  staticSampleConfig.$inject = ['$stateProvider'];

  function staticSampleConfig($stateProvider) {
    $stateProvider
      .state('dashboard.static.sample', {
        url: '/sample',
        template: '<jibbar-dashboard-static-sample></jibbar-dashboard-static-sample>'
      });
  }
})();
