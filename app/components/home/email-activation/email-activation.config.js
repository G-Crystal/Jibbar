(function () {
    'use strict';

    angular
        .module('jibbar.home.email-activation')
        .config(emailActivationConfig);

    emailActivationConfig.$inject = ['$stateProvider'];

    function emailActivationConfig($stateProvider) {
        $stateProvider
            .state('home.email-activation', {
                url: '/email-activation?userId&tenantId&confirmationCode',
                template: '<jibbar-home-email-activation></jibbar-home-email-activation>'
            });
    }
})();