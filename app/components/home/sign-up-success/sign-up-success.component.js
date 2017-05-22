(function () {
    'use strict';

    // Usage:
    // 
    // Creates:
    // 

    angular
        .module('jibbar.home.sign-up-success')
        .component('jibbarHomeSignUpSuccess', {
            templateUrl: 'components/home/sign-up-success/sign-up-success.html',
            controller: SignUpSuccessController,
            bindings: {
                Binding: '=',
            },
        });

    SignUpSuccessController.$inject = ['$stateParams'];

    function SignUpSuccessController($stateParams) {
        var vm = this;

        vm.newlyRegisterUser = {};
        vm.$onInit = $onInit;
        vm.$onChanges = $onChanges;
        vm.$onDestory = $onDestory;
        ////////////////

        function $onInit() {
            vm.newlyRegisterUser = $stateParams.registerUser;
        };

        function $onChanges(changesObj) {};

        function $onDestory() {};
    }
})();