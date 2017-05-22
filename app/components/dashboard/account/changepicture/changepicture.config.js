(function () {
  'use strict';

  angular
    .module('jibbar.dashboard.account.changepicture')
    .config(accountchangepictureConfig);

  accountchangepictureConfig.$inject = ['$stateProvider'];

  function accountchangepictureConfig($stateProvider) {
    $stateProvider
      .state('dashboard.account.changepicture', {
        url: '/changePicture',
        template: '<jibbar-dashboard-account-changepicture></jibbar-dashboard-account-changepicture>',
        params: {
           proceed: false,
        },
      });
  }
})();