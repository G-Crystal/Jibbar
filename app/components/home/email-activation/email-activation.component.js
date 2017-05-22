(function () {
    'use strict';

    var componentConfig = {
        templateUrl: 'components/home/email-activation/email-activation.html',
        controller: HomeEmailActivationController,
        bindings: {}
    };

    angular
        .module('jibbar.home.email-activation')
        .component('jibbarHomeEmailActivation', componentConfig);

    HomeEmailActivationController.$inject = ['authService', 'toastr', '$state', '$stateParams'];

    function HomeEmailActivationController(authService, toastr, $state, $stateParams) {
        var vm = this;
        vm.user = {
            tenancyName: "Default",
            emailAddress: ""
        }
        vm.userId = $stateParams.userId;
        vm.tenantId = $stateParams.tenantId;
        vm.confirmationCode = $stateParams.confirmationCode;

        vm.$onInit = $onInit;
        vm.activateEmail = activateEmail;


        function $onInit() {
            if (vm.confirmationCode) {
                var input = {
                    tenantId: vm.tenantId,
                    userId: vm.userId,
                    confirmationCode: vm.confirmationCode
                };
                authService.confirmEmail(input).then(
                    function (result) {
                        if (result.success) {
                            toastr.success("Your email activate successfully. Please check", "Successfull")
                            $state.go('home.sign-in');
                        } else {
                            toastr.error(result.error.details, result.error.message);
                        }
                    },
                    function (error) {
                        toastr.error(error.details, error.message);
                    }
                )
            }
        }

        function activateEmail(form) {
            if (!form.$valid) {
                return false;
            }
            //Email activation uri
            vm.user.apiEndPoint = $state.href('home.email-activation', {}, {
                absolute: true
            });

            authService.activateEmail(vm.user).then(
                function (result) {
                    if (result.success) {
                        toastr.success("A link sent to your email to activate your email address. Please check", "Successfull")
                        $state.go('home.sign-in');
                    } else {
                        toastr.error(result.error.details, result.error.message);
                    }
                },
                function (error) {
                    toastr.error(error.details, error.message);
                }
            )
        }
    }
})();