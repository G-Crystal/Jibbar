(function () {
  'use strict';

  angular
    .module('jibbar.dashboard')
    .config(dashboardConfig);

  dashboardConfig.$inject = ['$stateProvider'];

  function dashboardConfig($stateProvider) {
    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        template: '<jibbar-dashboard></jibbar-dashboard>',
        data: {
          authRequired: true
        }
      });
  }
})();