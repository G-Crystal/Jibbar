(function () {
    'use strict';

    angular
        .module('jibbar.home.pre-registration')
        .config(homePreRegistration);

    homePreRegistration.$inject = ['$stateProvider'];

    function homePreRegistration($stateProvider) {
        $stateProvider
            .state('home.pre-registration', {
                url: '/pre-registration',
                template: '<jibbar-home-pre-registration></jibbar-home-pre-registration>'
            });
    }
})();