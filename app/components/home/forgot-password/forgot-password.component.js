(function () {
    'use strict';

    var componentConfig = {
        templateUrl: 'components/home/forgot-password/forgot-password.html',
        controller: HomeForgotPasswordController,
        bindings: {}
    };

    angular
        .module('jibbar.home.forgot-password')
        .component('jibbarHomeForgotPassword', componentConfig);

    HomeForgotPasswordController.$inject = ['authService', 'toastr', '$state'];

    function HomeForgotPasswordController(authService, toastr, $state) {
        var vm = this;
        vm.user = {
            tenancyName: "Default",
            emailAddress: ""
        }
        vm.getPasswordResetLink = getPasswordResetLink;

        function getPasswordResetLink(form) {

            if (!form.$valid) {
                return false;
            }
            //Reset Password uri
            vm.user.apiEndPoint = $state.href('home.reset-password', {}, { absolute: true });
            authService.sendResetPasswordLink(vm.user).then(
                function (result) {
                    if (result.success) {
                        toastr.success("A mail with password reset link send to your account. Please check", "Successfull")
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