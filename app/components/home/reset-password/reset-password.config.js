(function () {
    'use strict';

    angular
        .module('jibbar.home.reset-password')
        .config(resetPasswordSuccessConfig);

    resetPasswordSuccessConfig.$inject = ['$stateProvider'];

    function resetPasswordSuccessConfig($stateProvider) {
        $stateProvider
            .state('home.reset-password', {
                url: '/reset-password?userId&tenantId&resetCode',
                template: '<jibbar-home-reset-password></jibbar-home-reset-password>'
            });
    }
})();