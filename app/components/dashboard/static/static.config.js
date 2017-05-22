(function () {
  'use strict';

  angular
    .module('jibbar.dashboard.static')
    .config(staticConfig);

  staticConfig.$inject = ['$stateProvider'];

  function staticConfig($stateProvider) {
    $stateProvider
      .state('dashboard.static', {
        url: '/static',
        abstract: true,
        template: '<jibbar-dashboard-static></jibbar-dashboard-static>'
      });
  }
})();
