(function () {
    'use strict';

    angular
        .module('jibbar.home.sign-up-success')
        .config(signUpSuccessConfig);

    signUpSuccessConfig.$inject = ['$stateProvider'];

    function signUpSuccessConfig($stateProvider) {
        $stateProvider
            .state('home.sign-up-success', {
                url: '/sign-up-success',
                template: '<jibbar-home-sign-up-success></jibbar-home-sign-up-success>',
                params: {
                    registerUser: null
                }
            });
    }
})();