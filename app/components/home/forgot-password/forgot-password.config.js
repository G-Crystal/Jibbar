(function () {
    'use strict';

    angular
        .module('jibbar.home.forgot-password')
        .config(forgotPasswordSuccessConfig);

    forgotPasswordSuccessConfig.$inject = ['$stateProvider'];

    function forgotPasswordSuccessConfig($stateProvider) {
        $stateProvider
            .state('home.forgot-password', {
                url: '/forgot-password',
                template: '<jibbar-home-forgot-password></jibbar-home-forgot-password>'
            });
    }
})();