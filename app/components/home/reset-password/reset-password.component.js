(function () {
    'use strict';

    var componentConfig = {
        templateUrl: 'components/home/reset-password/reset-password.html',
        controller: HomeResetPasswordController,
        bindings: {}
    };

    angular
        .module('jibbar.home.reset-password')
        .component('jibbarHomeResetPassword', componentConfig);

    HomeResetPasswordController.$inject = ['authService', 'toastr', '$state', '$stateParams'];

    function HomeResetPasswordController(authService, toastr, $state, $stateParams) {
        var vm = this;
        
        vm.userId = $stateParams.userId;
        vm.tenantId = $stateParams.tenantId;
        vm.resetCode = $stateParams.resetCode;
        vm.newPassword = '';

        vm.$onInit = $onInit;
        vm.resetMyPassword = resetMyPassword;


        function $onInit() {
            
        }

        function resetMyPassword(form) {
            if (!form.$valid) {
                return false;
            }
            var input = {
                tenantId: vm.tenantId,
                userId: vm.userId,
                resetCode: vm.resetCode,
                password: vm.newPassword
            };
            authService.resetPassword(input).then(
                function (result) {
                    if (result.success) {
                        toastr.success("Password have been reset successfully!", "Successfull")
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